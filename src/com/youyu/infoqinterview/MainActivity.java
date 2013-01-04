package com.youyu.infoqinterview;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.widget.LinearLayout;

import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;

public class MainActivity extends DroidGap{
	private final static String AdMob_Ad_Unit="a150dc0c459395f"; 
	private AdView adView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        //ad add start.
        adView = new AdView(this, AdSize.SMART_BANNER, AdMob_Ad_Unit);
        
        LinearLayout layout = super.root;
        layout.addView(adView);
        adView.loadAd( new AdRequest());
        //ad add end.
    }
}
