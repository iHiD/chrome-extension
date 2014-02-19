function fetch_user(success, error) {
    $.getJSON(BASE_URL + '/api/v1/my/details', success).fail(error)
}

function onSuccess() {
    chrome.tabs.getSelected(null, function(tab) {
        $('iframe#med_frame').attr('src', BASE_URL + '/bookmarklet/boards_selector?url=' + encodeURIComponent(tab.url))
    })
}

function onError(x, t, m) {
    document.location = 'login.html'
}

$(document).ready(function() {
    if (navigator.onLine) {
        fetch_user(onSuccess, onError)
    } else {
        onError()
    }
})


