package com.surfapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.thebylito.navigationbarcolor.NavigationBarColorPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.rnscreens.RNScreensPackage;
import com.bugsnag.BugsnagReactNative;
import com.brentvatne.react.ReactVideoPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.airbnb.android.react.maps.MapsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import org.wonday.orientation.OrientationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NavigationBarColorPackage(),
            new RNDeviceInfo(),
            new RNScreensPackage(),
            BugsnagReactNative.getPackage(),
            new ReactVideoPackage(),
            new RNCameraPackage(),
            new SvgPackage(),
            new AsyncStoragePackage(),
            new LocationServicesDialogBoxPackage(),
            new RNCWebViewPackage(),
            new MapsPackage(),
            new RNGoogleSigninPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
             new RNFusedLocationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
