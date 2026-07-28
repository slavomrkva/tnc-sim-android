package org.tncsim.twa;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Test;
import org.junit.Assume;
import org.junit.runner.RunWith;
import org.json.JSONObject;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(AndroidJUnit4.class)
public class TncSimInstrumentedTest {

    private static WebView findWebView(View view) {
        if (view instanceof WebView) return (WebView) view;
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            for (int index = 0; index < group.getChildCount(); index++) {
                WebView result = findWebView(group.getChildAt(index));
                if (result != null) return result;
            }
        }
        return null;
    }

    private static String evaluate(WebView webView, String javascript) throws Exception {
        AtomicReference<String> result = new AtomicReference<>();
        CountDownLatch completed = new CountDownLatch(1);
        InstrumentationRegistry.getInstrumentation().runOnMainSync(() ->
            webView.evaluateJavascript(javascript, value -> {
                result.set(value);
                completed.countDown();
            })
        );
        assertTrue("JavaScript evaluation timed out", completed.await(10, TimeUnit.SECONDS));
        return result.get();
    }

    private static void waitForTncUi(WebView webView) throws Exception {
        String result = null;
        for (int attempt = 0; attempt < 30; attempt++) {
            result = evaluate(webView,
                "document.readyState+'|'+!!document.getElementById('code')+'|'" +
                "+!!document.getElementById('runBtn')+'|'+!!document.getElementById('sim2d')");
            if ("\"complete|true|true|true\"".equals(result)) return;
            Thread.sleep(250);
        }
        assertEquals("TNC UI did not finish loading", "\"complete|true|true|true\"", result);
    }

    private static void runCuttingSmoke(WebView webView) throws Exception {
        String program =
            "BEGIN PGM DEVICE MM\n" +
            "BLK FORM 0.1 Z X-10 Y-10 Z-10\n" +
            "BLK FORM 0.2 X+10 Y+10 Z+5\n" +
            "TOOL CALL 1 Z S3000 F500\n" +
            "M3\n" +
            "L X+0 Y+0 Z+2 R0 FMAX\n" +
            "L Z-5 F500\n" +
            "L X+8 F500\n" +
            "L Z+2 FMAX\n" +
            "END PGM DEVICE MM";
        String startState = evaluate(webView,
            "(function(){try{codeEl.value=" + JSONObject.quote(program) + ";" +
            "dirty=true;speedIdx=SPEEDS.length-1;onRun();" +
            "return 'OK|'+mode+'|'+errorCount();" +
            "}catch(e){return 'EX|'+e.name+'|'+e.message;}})()");
        assertTrue("3D cutting smoke could not start: " + startState,
            startState != null && startState.startsWith("\"OK|"));

        String state = null;
        for (int attempt = 0; attempt < 80; attempt++) {
            state = evaluate(webView,
                "mode+'|'+!!(VX&&VX.hasCut)+'|'+!!glContextLost+'|'+errorCount()" +
                "+'|'+problemsData.map(function(p){return p.msg}).join(' / ')");
            if ("\"done|true|false|0|\"".equals(state)) return;
            Thread.sleep(250);
        }
        assertEquals("3D cutting smoke did not finish cleanly",
            "\"done|true|false|0|\"", state);
    }

    @Test
    public void launchesPackagedOfflineUiAndSurvivesRecreate() throws Exception {
        assertEquals("org.tncsim.twa",
            InstrumentationRegistry.getInstrumentation().getTargetContext().getPackageName());

        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            AtomicReference<WebView> webViewRef = new AtomicReference<>();
            scenario.onActivity(activity -> {
                WebView webView = findWebView(activity.getWindow().getDecorView());
                assertNotNull("Capacitor must create a WebView", webView);
                assertTrue("TNC Sim requires JavaScript", webView.getSettings().getJavaScriptEnabled());
                webViewRef.set(webView);
            });

            waitForTncUi(webViewRef.get());
            assertEquals("\"1.0.97\"", evaluate(webViewRef.get(), "APP_VERSION"));
            assertTrue("Capacitor must eventually inject native safe-area values",
                !"\"\"".equals(evaluate(webViewRef.get(),
                    "getComputedStyle(document.documentElement)" +
                    ".getPropertyValue('--safe-area-inset-top')")));

            scenario.recreate();
            webViewRef.set(null);
            scenario.onActivity(activity ->
                webViewRef.set(findWebView(activity.getWindow().getDecorView())));
            assertNotNull("WebView must survive Activity recreation", webViewRef.get());
            waitForTncUi(webViewRef.get());
            runCuttingSmoke(webViewRef.get());
        }
    }

    @Test
    public void upgradePersistenceProbe() throws Exception {
        String phase = InstrumentationRegistry.getArguments().getString("upgradePhase");
        Assume.assumeTrue("upgrade probe runs only when explicitly requested",
            "seed".equals(phase) || "verify".equals(phase));

        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            AtomicReference<WebView> webViewRef = new AtomicReference<>();
            scenario.onActivity(activity ->
                webViewRef.set(findWebView(activity.getWindow().getDecorView())));
            assertNotNull("Upgrade probe requires the Capacitor WebView", webViewRef.get());
            waitForTncUi(webViewRef.get());
            String expectedVersion =
                InstrumentationRegistry.getArguments().getString("expectedAppVersion");
            if (expectedVersion != null) {
                assertEquals(JSONObject.quote(expectedVersion),
                    evaluate(webViewRef.get(), "APP_VERSION"));
            }

            if ("seed".equals(phase)) {
                assertEquals("\"preserved-1.0.4\"", evaluate(webViewRef.get(),
                    "localStorage.setItem('tncSimUpgradeProbe','preserved-1.0.4');" +
                    "localStorage.getItem('tncSimUpgradeProbe')"));
                // Give the WebView storage backend time to flush before the
                // instrumentation process closes the Activity.
                Thread.sleep(1500);
            } else {
                assertEquals("localStorage must survive an in-place app update",
                    "\"preserved-1.0.4\"", evaluate(webViewRef.get(),
                    "localStorage.getItem('tncSimUpgradeProbe')"));
            }
        }
    }
}
