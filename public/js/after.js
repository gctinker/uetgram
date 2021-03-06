$(document).ready(function () {

  'use strict';
  // ------------------------------------------------------- //
  // Search Box
  // ------------------------------------------------------ //
  $('#search').on('click', function (e) {
    e.preventDefault();
    $('.search-box').fadeIn();
    $('#searchContent').focus();
  });
  $('.dismiss').on('click', function () {
    $('.search-box').fadeOut();
  });
  // ------------------------------------------------------- //
  // Sidebar Functionality
  // ------------------------------------------------------ //
  $('#toggle-btn').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('active');

    $('.side-navbar').toggleClass('shrinked');
    $('.content-inner').toggleClass('active');

    if ($(window).outerWidth() > 1183) {
      if ($('#toggle-btn').hasClass('active')) {
        $('.navbar-header .brand-small').hide();
        $('.navbar-header .brand-big').show();
      } else {
        $('.navbar-header .brand-small').show();
        $('.navbar-header .brand-big').hide();
      }
    }

    if ($(window).outerWidth() < 1183) {
      $('.navbar-header .brand-small').show();
    }
  });

});

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "slideUp"
  }

$('#searchForm').on('keyup keypress', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13 && !$("#searchContent").val()) {
    e.preventDefault();
    return false;
  }
});

$("#searchContent").change(function () {
  if ($("#searchContent").val()) {
    $('#searchForm').attr('action', '/search/' + $("#searchContent").val());
  } else {
    $('#searchForm').attr('action', '#');
  }
});

$("#img-form").change(function () {
  $("#image").empty();
  var typeValid = true;
  var sizeValid = true;
  var typeError = '<p style="color: red"> Định dạng không được hỗ trợ! </p>';
  var sizeError = '<p style="color: red"> Dung lượng quá lớn để tải lên! </p>';
  for (var i = 0; i < $('#img-form')[0].files.length; i++) {
    if (this.files && this.files[i]) {
      var img = $('#img-form')[0].files[i];
      var fsize = img.size;
      if (!img.name.match(/.(jpg|png|jpeg|jpe)$/i)) {
        typeValid = false;
      }
      if (fsize > 3000000) {
        sizeValid = false;
      }
    }
  }
  if (typeValid && sizeValid) {
    document.getElementById('img-form').style.border = "1px solid #09F";
    document.getElementById('add-img-bt').disabled = false;
    readURL(this);
  } else {
    if (!typeValid) {
      $("#image").append(typeError);
    }
    if (!sizeValid) {
      $("#image").append(sizeError);
    }
    document.getElementById('img-form').style.border = "3px solid #F00";
    document.getElementById('add-img-bt').disabled = true;
  }
});

function readURL(input) {
  if (input.files) {
    var l = $('#img-form')[0].files.length;
    if (l <= 5) {
      var width = 100 / l;
      var reader = new Array();
      for (var i = 0; i < l; i++) {
        reader[i] = new FileReader();
        reader[i].onload = function (e) {
          var html = '<img src="' + e.target.result + '" width="' + width + '%" style="padding:2px;"/>'
          $("#image").append(html);
        }
        reader[i].readAsDataURL(input.files[i]);
      }
    } else if (l > 5) {
      var width = 20;
      var reader = new Array();
      for (var i = 0; i < l; i++) {
        reader[i] = new FileReader();
        reader[i].onload = function (e) {
          var html = '<img src="' + e.target.result + '" width="' + width + '%" style="padding:2px;"/>'
          $("#image").append(html);
        }
        reader[i].readAsDataURL(input.files[i]);
      }
    }
  }
}

$(document).ready(function () {
  var last = localStorage.getItem("id");
  if (last != null) {
    //remove default collapse settings
    $("#searchResult .collapse").removeClass('show');
    //show the last visible group
    $("#" + last).collapse("show");
  }
});

$('#searchResult').on('shown.bs.collapse', function () {
  var active = $("#searchResult .show").attr('id');
  localStorage.setItem('id', active);
});

$('#searchResult').on('hidden.bs.collapse', function () {
  localStorage.removeItem('id');
});

function clickImg(index) {
  $("header.up").slideUp();
  $("section.up").slideUp();
  if ($('#toggle-btn').hasClass('active')) {
    $("#toggle-btn").click();
  }
  $("#image-detail").fadeIn();
  $('#image-detail').find('.carousel-item:nth-child(' + index + ')').addClass('active');
}

function hide() {
  $("#image-detail .carousel-item.active").removeClass('active');
  $("#image-detail").fadeOut();
  $("#toggle-btn").click();
  $("header.up").slideDown();
  $("section.up").slideDown();
}

$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  })
});

function comment(id, name, lv) {
  var content = $("#form-cmt" + id).find("textarea[name='content']").val();
  if (content.trim() != "") {
    var _token = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
      url: "/images/comments/" + id + "/addcomment",
      type: "POST",
      cache: false,
      data: {
        "_token": _token,
        "content": content,
        "idImg": id
      },
      success: function (data) {
        if (data) {
          if (lv == 0) {
            var html = `<div class="comment" id="comment` + data + `">
                            <p class="inline"><strong><a href="/images/user/` + name + `">` + name + `</a></strong> : ` + content + `</p></br>
                            <button onClick="deleteCmt(` + data + `)" class="btn btn-sm btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>`;
          } else {
            var html = `<div class="comment" id="comment` + data + `">
                            <p class="inline"><strong><a href="/images/user/` + name + `">` + name + `</a></strong> : ` + content + `</p></br>
                            <button onClick="deleteCmt(` + data + `)" class="btn btn-sm btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>
                            <button onClick="makeDescription(` + data + `,` + id + `)" class="btn btn-sm btn-info"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>
                            </div>`;
          }
          $("#comment-area" + id).append(html);
          $("#form-cmt" + id).find("textarea[name='content']").val('');
        }
      }
    });
  }
}

function makeDescription(idCmt, idImg) {
  var _token = $('meta[name="csrf-token"]').attr('content');
  $.ajax({
    url: "/images/" + idImg + "/description",
    type: "POST",
    cache: false,
    data: {
      "_token": _token,
      "idImg": idImg,
      "idCmt": idCmt
    },
    success: function (data) {
      if (data) {
        $("#content" + idImg).empty();
        var newContent = `
          <label>Mô tả:&nbsp;</label>
          <p id="img-content` + idImg + `" class="inline">` + data + ` </p>  
          <a href="javascript:void(0)" onClick="editDescription(` + idImg + `)"><i class="fa fa-pencil" aria-hidden="true"></i></a>
          <a href="javascript:void(0)" onClick="deleteDescription(` + idImg + `)" class="del"><i class="fa fa-times" aria-hidden="true"></i></a>`;
        $("#content" + idImg).append(newContent);
      }
    }
  });
}

function editTitle(idImg) {
  var old = document.getElementById("title" + idImg).innerHTML;
  var title = '';
  if (document.getElementById("img-title" + idImg)) {
    title = document.getElementById("img-title" + idImg).innerHTML;
    title = title.trim();
  }
  $("#title" + idImg).empty();
  var html = `<label>Tiêu đề mới:&nbsp;</label>
    <input type="text" class="form-control" placeholder="Tiêu đề..." id="edit-title` + idImg + `">`;
  $("#title" + idImg).append(html);
  $("#edit-title" + idImg).val(title);
  $("#edit-title" + idImg).focus();
  $("#edit-title" + idImg).on('keyup', function (e) {
    var title = $("#edit-title" + idImg).val();
    if (e.keyCode == 13 && title.trim() != '') {
      var _token = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: "/images/" + idImg + "/edit",
        type: "POST",
        cache: false,
        data: {
          "_token": _token,
          "idImg": idImg,
          "title": title
        },
        success: function (data) {
          if (data) {
            var json = JSON.parse(data);
            $("#title" + idImg).empty();
            var newTitle = `
            <label>Tiêu đề ảnh:&nbsp;</lable>
            <h1 id="img-title` + idImg + `" class="inline">` + json['title'] + `     </h1>
            <h1 class="inline"><a href="javascript:void(0)" onClick="editTitle(` + idImg + `)"><i class="fa fa-pencil" aria-hidden="true"></i></a></h1>
            <h1 class="inline"><a href="javascript:void(0)" onClick="deleteTitle(` + idImg + `)" class="del"><i class="fa fa-times" aria-hidden="true"></i></a></h1>`;
            $("#title" + idImg).append(newTitle);
          }
        }
      });
    }
  });
  $("#edit-title" + idImg).focusout(function () {
    $("#title" + idImg).empty();
    $("#title" + idImg).append(old);
  });
}

function deleteTitle(idImg) {
  var _token = $('meta[name="csrf-token"]').attr('content');
  $.ajax({
    url: "/images/" + idImg + "/empty",
    type: "POST",
    cache: false,
    data: {
      "_token": _token,
      "idImg": idImg,
      "val": 'title'
    },
    success: function (data) {
      if (data) {
        $("#title" + idImg).empty();
        var newTitle = `<a href="javascript:void(0)" onClick="editTitle(` + idImg + `)" class="btn btn-info btn-sm">Thêm tiêu đề</a>`;
        $("#title" + idImg).append(newTitle);
      }
    }
  });
}

function deleteDescription(idImg) {
  var _token = $('meta[name="csrf-token"]').attr('content');
  $.ajax({
    url: "/images/" + idImg + "/empty",
    type: "POST",
    cache: false,
    data: {
      "_token": _token,
      "idImg": idImg,
      "val": 'content'
    },
    success: function (data) {
      if (data) {
        $("#content" + idImg).empty();
        var newDescription = `<a href="javascript:void(0)" onClick="editDescription(` + idImg + `)" class="btn btn-info btn-sm">Thêm mô tả</a>`;
        $("#content" + idImg).append(newDescription);
      }
    }
  });
}

function editDescription(idImg) {
  var old = document.getElementById("content" + idImg).innerHTML;
  var content = '';
  if (document.getElementById("img-content" + idImg)) {
    content = document.getElementById("img-content" + idImg).innerHTML;
    content = content.trim();
  }
  $("#content" + idImg).empty();
  var html = `
    <label>Mô tả mới</label>
    <textarea class="form-control" rows="3" placeholder="Mô tả..." id="edit-content` + idImg + `"></textarea>`;
  $("#content" + idImg).append(html);
  $("#edit-content" + idImg).val(content);
  $("#edit-content" + idImg).focus();
  $("#edit-content" + idImg).on('keyup', function (e) {
    var content = $("#edit-content" + idImg).val();
    if (e.keyCode == 13 && content.trim() != '') {
      var _token = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: "/images/" + idImg + "/edit",
        type: "POST",
        cache: false,
        data: {
          "_token": _token,
          "idImg": idImg,
          "content": content
        },
        success: function (data) {
          if (data) {
            var json = JSON.parse(data);
            $("#content" + idImg).empty();
            var newContent = `
              <label>Mô tả:&nbsp;</label>
              <p id="img-content` + idImg + `" class="inline">` + json['content'] + `     </p>  
              <a href="javascript:void(0)" onClick="editDescription(` + idImg + `)"><i class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="javascript:void(0)" onClick="deleteDescription(` + idImg + `)" class="del"><i class="fa fa-times" aria-hidden="true"></i></a>`;
            $("#content" + idImg).append(newContent);
          }
        }
      });
    }
  });
  $("#edit-content" + idImg).focusout(function () {
    $("#content" + idImg).empty();
    $("#content" + idImg).append(old);
  });
}

function deleteCmt(id) {
  var _token = $('meta[name="csrf-token"]').attr('content');
  $.ajax({
    url: "/images/comments/delete/" + id,
    type: "POST",
    cache: false,
    data: {
      "_token": _token,
      "id": id
    },
    success: function (data) {
      if (data) {
        $("#comment" + data).remove();
      }
    }
  });
}

function addTag(id) {
  var html = `<div id="tag-input` + id + `">
                <div class="input-group input-group-sm" style="width:100%">
                <span class="input-group-addon input-group-addon-sm">#</span>
                <input id="input` + id + `" type="text" class="form-control input-sm" placeholder="Nhãn...">
                </div>
              </div>`;
  $("#add-tag-area" + id).empty();
  $("#add-tag-area" + id).append(html);
  $("#input" + id).focus();
  $("#input" + id).on('keyup', function (e) {
    var content = $("#input" + id).val();
    if (e.keyCode == 13 && content.trim() != '') {
      if(content.trim().length < 20) {
        var _token = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
          url: "/images/tags/" + id + "/addtag",
          type: "POST",
          cache: false,
          data: {
            "_token": _token,
            "idImg": id,
            "content": content
          },
          success: function (data) {
            if (data == "Existed") {
              toastr.warning("Ảnh đã có sẵn nhãn bạn nhập!");
            } else {
              var json = JSON.parse(data);
              var tag = `<div id="tag` + json['id'] + `" class="inline tag">
                          <a href="/images/tags/` + json['content'] + `" class="tag-content">#` + json['content'] + `</a>
                          <a href="javascript:void(0)" onClick="deleteTag(` + id + `,` + json['id'] + `)" class="tag-del"><i class="fa fa-times" aria-hidden="true"></i></a>
                          </div>`;
              $("#tag-area" + id).append(tag);
              $("#add-tag-area" + id).empty();
            }
          }
        });
      }
      else {
        toastr.warning("Nhãn không được chứa quá 20 ký tự!");
      }
    }
  });
  $("#input" + id).focusout(function () {
    $("#add-tag-area" + id).empty();
  });
}

function deleteTag(idImg, idTag) {
  var _token = $('meta[name="csrf-token"]').attr('content');
  $.ajax({
    url: "/images/tags/" + idImg + "/delete/" + idTag,
    type: "POST",
    cache: false,
    data: {
      "_token": _token,
      "idImg": idImg,
      "idTag": idTag
    },
    success: function (data) {
      if (data == "OK") {
        $("#tag" + idTag).remove();
      }
    }
  });
}

function downloadSingle(location) {
  $("#single-hidden-link").attr("href", location);
  document.getElementById("single-hidden-link").click();
}
