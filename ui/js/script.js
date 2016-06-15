(function ($) {
  var esivis = $('#esi-vis');
  var yleApp = {
    formatNr: function (x, addComma) {
      x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
      x = x.replace('.', ',');
      if (addComma === true && x.indexOf(',') === -1) {
        x = x + ',0';
      }
      return (x === '') ? 0 : x;
    },
    roundNr: function (x, d) {
      return parseFloat(x.toFixed(d));
    },
    getScale: function () {
      var width = esivis.width();
      if (width >= 578) {
        esivis.addClass('wide');
        return true;
      }
      if (width < 578) {
        esivis.removeClass('wide');
        return false;
      }
    },
    fixHeights: function () {
      $('.container', esivis).height($(window).height());
    },
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    initNumbers: function (element, stop, duration, ease) {
      var start = parseInt(element.text().replace(/,/g, ''));
      $({value: start}).animate({value: stop}, {
        duration: duration == undefined ? 1000 : duration,
        easing: ease == undefined ? 'swing' : ease,
        step: function () {
          element.text(Math.floor(this.value));
          element.text(element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
        },
        complete: function () {
          if (parseInt(element.text()) !== stop) {
            element.text(stop);
            element.text(element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
          }
        }
      });
    },
    getCurrentPrice: function () {
      var price = yleApp.getRandomInt(50, 150)
      return price;
    },
    calculateAsset: function (action) {
      yleApp.var.eventIndex++;
      // First action.
      var current_price = yleApp.getCurrentPrice();
      if (yleApp.var.lastPrice === false) {
        yleApp.var.lastPrice = current_price;
        $('<div>' + yleApp.var.eventIndex + '. First bought price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
      }
      // Rest of the actions.
      else {
        if (action === 'sell') {
          if (yleApp.var.eventIndex > 5) {
            yleApp.printResult();
          }
          yleApp.var.asset = yleApp.var.asset * (((current_price / yleApp.var.lastPrice) - 1)) + yleApp.var.asset;
          $('<div>' + yleApp.var.eventIndex + '. Sell price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
        }
        else if (action === 'buy') {
          // yleApp.var.asset = (yleApp.var.lastPrice / current_price) * yleApp.var.asset;
          $('<div>' + yleApp.var.eventIndex + '. Bought price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
        }
        yleApp.var.lastPrice = current_price;
        return parseInt(yleApp.var.asset);
      }
    },
    printResult: function () {
      var container = $('.result_wrapper', esivis).empty();
      if (yleApp.var.asset > 100) {
        var text = 'You gained assets';
      }
      else if (yleApp.var.asset < 100) {
        var text = 'You lost assets';
      }
      else {
        var text = 'You broke even';
      }
      yleApp.var.highscore.push(yleApp.var.asset);
      yleApp.var.highscore.sort();
      $('<h1>' + text + '</h1>').appendTo(container);
      $('<h3>You started with 100 and you got ' + parseInt(yleApp.var.asset) + '.</h3>').appendTo(container);
      $('<p>Sed ultricies interdum nisi, non laoreet massa condimentum vitae. Ut at dignissim ligula. Nulla in vehicula turpis. Duis placerat erat vitae sapien interdum, at ornare lectus egestas. Suspendisse aliquam velit quis lacus mattis, vel pharetra erat euismod.</p>').appendTo(container);
      $('<h3>Top scores</h3>').appendTo(container);
      var list_container = $('<ol></ol>').appendTo(container);
      $.each(yleApp.var.highscore, function (i, highscore) {
        $('<li>' + parseInt(highscore) + '</li>').appendTo(list_container);
      });
      $('<button class="control play_again change_view button" data-show=".game_container" data-hide=".result_container"><div><img src="" class="button_img" /></div><div class="button_text">Play again</div></button>').appendTo(container);
      $('.game_container', esivis).fadeOut(500);
      $('.result_container', esivis).fadeIn(500);
    },
    counter: function () {
      $('.counter', esivis).text('4');
      $('.counter_container', esivis).show();
      var interval = setInterval(function () {
        var value = parseInt($('.counter', esivis).text());
        if (value === 4) {
          $('.asset_container', esivis).fadeIn(500);
        }
        if (value === 3) {
          $('.vis_container', esivis).fadeIn(500);
        }
        if (value === 2) {
          $('.controls_container .control', esivis).fadeIn(500);
        }
        if (value === 1) {
          clearInterval(interval);
          $('.counter', esivis).text(value - 1);
          $('.counter_container', esivis).fadeOut(700);
        }
        else {
          $('.counter', esivis).text(value - 1);
        }
      }, 1000);
    },
    getHighScores: function (update) {
      var get_parameter = (update === true) ? Date.now() / 1000 | 0 : '';
      $.ajax({
        dataType:'json',
        statusCode:{
          200: function (data) {
            yleApp.printHighScores(data);
          }
        },
        url:'/php/get.php?timestamp=' + get_parameter,
        type:'GET'
      });
    },
    printHighScores: function (data) {
      var container = $('.highscores_wrapper', esivis).empty();
      $('<h3>All time high</h3>').appendTo(container);
      var list_container = $('<ol></ol>').appendTo(container);
      $.each(data, function (i, highscore) {
        $('<li>' + highscore.nickname + ': ' + parseInt(highscore.score) + '</li>').appendTo(list_container);
      });
    },
    postHighscore: function (data) {
      $.ajax({
        data:data,
        dataType:'json',
        statusCode:{
          200: function (data) {
            yleApp.getHighScores(true);
          }
        },
        url:'/php/post.php',
        type:'POST'
      });
    },
    initEvents: function () {
      $(window).resize(function () {
        yleApp.getScale();
      });
      // Change view.
      esivis.on('click', '.control.change_view', function (event) {
        $($(this).data('hide'), esivis).fadeOut(500);
        $($(this).data('show'), esivis).fadeIn(1000);
      });
      // Init game.
      esivis.on('click', '.init_game', function (event) {
        yleApp.counter();
      });
      // Play again.
      esivis.on('click', '.play_again', function (event) {
        yleApp.destroy();
        yleApp.counter();
      });
      // Sell event.
      esivis.on('click', '.control.buy', function (event) {
        yleApp.calculateAsset('sell');
        $(this).removeClass('buy').addClass('sell').text('sell');
        event.preventDefault();
      });
      // Buy event.
      esivis.on('click', '.control.sell', function (event) {
        yleApp.initNumbers($('.asset_value', esivis), yleApp.calculateAsset('sell'), 1000, 'swing');
        $(this).removeClass('sell').addClass('buy').text('buy');
        event.preventDefault();
      });
      esivis.on('click', '.submit', function (event) {
        yleApp.postHighscore({
          nickname:($('.nickname', esivis).val() === '') ? 'Anonymous' : $('.nickname', esivis).val(),
          score:yleApp.var.highscore.sort()[0]
        });
        $(this).prop('disabled', true).addClass('disabled');
        $(this).find('.button_text').text('Thank you!');
      });
    },
    destroy: function  (argument) {
      yleApp.var.asset = 100;
      yleApp.var.eventIndex = 0;
      yleApp.var.lastPrice = false;
      $('.container', esivis).scrollTop(0);
      $('.submit', esivis).prop('disabled', false).removeClass('disabled');
      $('.submit', esivis).find('.button_text').text('Submit score');
      $('.asset_value', esivis).text(yleApp.var.asset);
      $('.log_container', esivis).empty();
    },
    init: function () {
      yleApp.var = {};
      yleApp.var.highscore = [];
      yleApp.destroy();
      yleApp.initEvents();
      yleApp.fixHeights();
      yleApp.getHighScores();
      new Vis().init();
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
