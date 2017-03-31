$(document).ready(function() {
  //Change the backgroud color with a circle
  $('.circle').addClass('growing-circle');
  setTimeout(function() {
      //Change the background color
      $('body').addClass('started');
      //Move name update to the top
      $('.name').addClass('nameUpdate');
      $('.name').addClass('started');
      $('.main').addClass('active')
      setTimeout(function() {
          $('body').removeClass('started');
          $('body').addClass('white');
          $('.circle').addClass('remove-circle');
      }, 500);
  }, 1000);


  var socket = io();
  socket.on('clean', function() {
      $('.main').empty();
      $('.main').append('<div>Demo of those applications will be available soon.</div>');
  });

  socket.on('gitAdd', function(obj) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      description = obj.description != null ? obj.description.replace(urlRegex, function(url) {return '<a target="_blank" href="' + url + '">' + url + '</a>'}) : "Description à venir";
      name = obj.name != null ? obj.name : "";
      language = "";
      if (obj.language != null) {
          for (i in obj.language) {
              language += '<span class="language ' + i + '">' + i + '</span>';
          }
      }
      url = obj.url != null ? obj.url : "#";
      html = '<div>' +
          '<div class="gitRepo">' +
          '<div class="title"><h2><a target="_blank" href="' + url + '">' + name + '</a><small> <a target="_blank" href="' + url + '"><img src="github.png" alt="Voir sur Github" /></a></small></h2></div>' +
          language +
          '<div class="description">' + description + '</div>' +
          '</div>' +
          '</div>';
      $('.main').append(html);
  });
});
