let price = 0;
let currency = 'btc';
let searchParams = new URLSearchParams(window.location.search);
let btc = searchParams.get('btc');
let eth = searchParams.get('eth');
let green = '#50fa7b';
let red = '#ff5555';
let orange = '#ffb86c';
let aquamarine = '#8be9fd';
let blue = '#6272a4';

function update() {
    $.get("https://api.coinbase.com/v2/prices/" + currency + "-usd/spot", function (data) {
        let newPrice = parseInt(data.data.amount.split(".")[0]);
        let currencyElement = $("#currency");

        if (price > 0 && price !== newPrice) {
            currencyElement.css('color', newPrice > price ? green : red);
            setTimeout(function () { currencyElement.css('color', orange); }, 2000);
        }

        price = newPrice;
        currencyElement.html("$");
        $("#value").html(price.toLocaleString());
        $(document).prop('title', "$" + price.toLocaleString() + " | HODL Crypto Ticker");

        updateWealth();
    });
}

function updateWealth() {
    let wealth = 0;

    if (btc || eth) {
        $.when($.get("https://api.coinbase.com/v2/prices/btc-usd/spot"), $.get("https://api.coinbase.com/v2/prices/eth-usd/spot")).then(function (r1, r2) {
            if (btc) {
                let btcPrice = parseInt(r1[0].data.amount);
                wealth = btc * btcPrice;
            }
            if (eth) {
                let ethPrice = parseInt(r2[0].data.amount);
                wealth += eth * ethPrice;
            }
            $("#wealth").html("$" + Math.trunc(wealth).toLocaleString());
        });
    }
}

function cryptoChange(isBtc) {
    price = 0;
    currency = isBtc ? 'btc' : 'eth';

    $("#btc").css("color", isBtc ? aquamarine : blue);
    $("#eth").css("color", isBtc ? blue : aquamarine);

    Cookies.set('currency', isBtc ? 'btc' : 'eth', {expires: 365, secure: true});

    update();

    window.fathom.trackGoal(isBtc ? '3OCRZJLA' : '0QYDFPPK', 0);
}

function setup() {
    let btcBtn = $("#btc");
    let ethBtn = $("#eth");

    if (Cookies.get('currency') === 'eth') {
        currency = 'eth';
        ethBtn.css("color", aquamarine)
        btcBtn.css("color", blue)
    }

    update();

    setInterval(function () {
        update();
    }, 3000);

    setInterval(function () {
        $("#moon").effect("bounce", "slow");
    }, 60000);

    setInterval(function () {
        location.reload();
    }, 3600000);

    btcBtn.click(function () {
        cryptoChange(true);
    });

    ethBtn.click(function () {
        cryptoChange(false);
    });

    $("#help")
        .prop("title", "<ul><li>Basic: https://hodl.ws</li><li>Wealth: https://hodl.ws/?btc=1.2&amp;eth=3.4</li><li>Bottom-Left crypto switcher</li></ul>")
        .tooltip({
            content: function () {
                return $(this).prop('title');
            }
        })
        .mouseenter(function () {
            window.fathom.trackGoal('TNFSRU2M', 0);
        });
}