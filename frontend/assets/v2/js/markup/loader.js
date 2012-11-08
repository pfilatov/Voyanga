var arr_textLoad = ['Это займет от 5 до 30 секунд', 'Мы ищем среди 450 авиакомпаний','Уже почти готово', 'Ещё секундочку', 'Немного терпения'];
var pointsInterval, textInterval, started = false, var_loadTextCounts = 0;
var loadLight = $('#loadLight');
var loadText = $('#changeText');
function loaderChange(toStart) {
    if (toStart)
    {
        if (started)
            return;
        pointsInterval = setInterval(runPoints, 500);
        textInterval = setInterval(runText, 12000);
        started = true;
    }
    else
    {
        clearInterval(pointsInterval);
        clearInterval(textInterval);
        started = false;
    }
}

function runPoints() {

    var ind = loadLight.find('li.active').index();
    ind += 1;
    if (ind == loadLight.find('li').length) {
        ind = 0;
    }
    loadLight.find('li').removeClass('active');
    loadLight.find('li').eq(ind).addClass('active');
}

function runText() {
    loadText.text(arr_textLoad[var_loadTextCounts]);
    var_loadTextCounts += 1;
    if (var_loadTextCounts == arr_textLoad.length) {
        var_loadTextCounts = 0;
    }
    loadText.text(arr_textLoad[var_loadTextCounts]);
}
