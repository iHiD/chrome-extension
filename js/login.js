function openLogin() {
    chrome.tabs.create({
        'url': BASE_URL + '/login'
        }, function(tab) {
        // Tab opened.
        });
    alert()
}

$(document).ready(function() {
    $('a.login').click(openLogin)
})


