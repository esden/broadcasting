var Twit = require('twit');
var tracery = require('tracery-grammar');
var post_screenshot = require('./post-screenshot');

var T = new Twit(require('./robotbabyhw_account.json'));

var grammar = tracery.createGrammar({

    'url': ['http://misc.name/404'],

    'stream': [ 'stream', 'stream', 'stream', 'live stream', 'broadcast', 'vid stream', 'livestream' ],
    'started': [ 'started', 'started', 'started', 'going', 'going', 'up' ],
    'exclam': [ '!', '!', '!', '!', '!', '~', '.', '.', '.', '.', '!!' ],
    'excomma': [ ',', '#exclam#' ],
    'excite': [ 'wow', 'whoa', 'neat', 'woww', 'cool' ],

    'starting': [
        'Getting another #stream# #started##exclam#',
        'Going LIVE#exclam#',
        'Starting up another #stream#;',
        'Let\'s get another #stream# #started##exclam#',
        'Streaming now#exclam#',
        '#stream.capitalize# time#exclam#',
        'Broadcasting LIVE#exclam#',
    ],

    'continuing': [
        '#excite.capitalize##excomma# #stream.capitalize# is still going#exclam#',
        '#stream.capitalize# is still going#exclam#',
        '#stream.capitalize# still happening#exclam#',
        'Still #stream#ing#exclam#',
    ],

    'content': [
        '#firstContent.capitalize# & #lastContent##exclam#',
    ],

    'firstContent': [ 'widgets', 'things', 'ephemera', 'widgits', 'oddities' ],
    'lastContent': [ 'cat', 'cat', 'cat', 'kitty', 'little tiger', 'purr monster', 'fluff tiger' ],

    'first_tweet': ['#starting# #content# #url#'],
    'periodic_tweet': ['#continuing# #content# #url#']
});

grammar.addModifiers(tracery.baseEngModifiers);

function tweet(template, media_ids) {
    var flat;
    do {
        flat = grammar.flatten(template);
    } while (flat.length > 140);
    if (T) {
        T.post('statuses/update', { status: flat, media_ids: media_ids }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Tweet sent: ' + data.text);
            }
        });
    } else {
        console.log(flat);
    }
}

tweet('#first_tweet#');

setInterval( function () {
    post_screenshot( T, function (err, data) {
        tweet('#periodic_tweet#', [ data.media_id_string ]);
    });
}, 10 * 60 * 1000);
