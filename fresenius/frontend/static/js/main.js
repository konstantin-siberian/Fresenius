$( document ).ready(function() {
    $(".login-button").click(function () {
        var login = $("#login").val();
        var password = $("#password").val();
        document.location.href='select.html';
    });
});