package app.cyla;

import android.util.Base64;
import android.util.Log;
import com.cossacklabs.themis.InvalidArgumentException;
import com.cossacklabs.themis.NullArgumentException;
import com.cossacklabs.themis.SecureCell;
import com.cossacklabs.themis.SecureCellException;
import com.facebook.react.ReactActivity;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "frontend";
    }
}
