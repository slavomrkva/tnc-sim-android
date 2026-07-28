package org.tncsim.twa;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class PackageIdentityTest {

    @Test
    public void applicationIdKeepsExistingPlayListing() {
        assertEquals("org.tncsim.twa", MainActivity.class.getPackage().getName());
    }
}
