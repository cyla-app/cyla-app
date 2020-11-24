package app.cyla;

import android.app.Application;
import android.content.Context;
import android.util.Base64;
import android.util.Log;
import com.cossacklabs.themis.InvalidArgumentException;
import com.cossacklabs.themis.NullArgumentException;
import com.cossacklabs.themis.SecureCell;
import com.cossacklabs.themis.SecureCellException;
import com.cyla.BuildConfig;
import com.facebook.react.*;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());
                    return packages;
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
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        try {
            encryptDataForStoring();
        } catch (SecureCellException e) {
            e.printStackTrace();
        }
    }

    void encryptDataForStoring() throws SecureCellException, NullArgumentException, InvalidArgumentException {
        Charset charset = StandardCharsets.UTF_8;
        String pass = "pass";
        String message = "hello message";

        SecureCell.Seal sc = SecureCell.SealWithPassphrase(pass, charset);

        byte[] protectedData = sc.encrypt(message.getBytes(charset));
        String encodedString = Base64.encodeToString(protectedData, Base64.NO_WRAP);
        Log.d("SMC", "encrypted string = " + encodedString);

        byte[] decodedString = Base64.decode(encodedString, Base64.NO_WRAP);

        byte[] unprotected = sc.decrypt(decodedString);
        String decryptedData = new String(unprotected, charset);
        Log.d("SMC", "decrypted data = " + decryptedData);
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(
            Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("app.cyla.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}
