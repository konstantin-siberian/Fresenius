from django import forms
from django.contrib.auth.forms import AuthenticationForm, UsernameField
from django.utils.translation import gettext, gettext_lazy as _


class MyAuthenticationForm(AuthenticationForm):
    
    username = UsernameField(
        widget=forms.TextInput(attrs={'autofocus': True}),
        label=_("Login"),
        label_suffix=""
        )
    password = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput,
        label_suffix="",
    )

    error_messages = {
        'invalid_login': _(
            "Please enter a correct %(username)s and password. Note that both "
            "fields may be case-sensitive."
        ),
        'inactive': _("This account is inactive."),
    }