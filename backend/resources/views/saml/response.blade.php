<!DOCTYPE html>
<html>
<body onload="document.forms[0].submit()">
    <form method="POST" action="{{ $acs_url }}">
        <input type="hidden" name="SAMLResponse" value="{{ $saml_response }}">
        <input type="hidden" name="RelayState" value="{{ $relay_state }}">
        <button type="submit">Submit</button>
    </form>
</body>
</html>