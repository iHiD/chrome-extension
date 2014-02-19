var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Meducation = {}


Meducation.Groups = (function() {
   function Groups() {}

   Groups.fetchUserGroups = function(callback) {
     if (Meducation.userGroups) {
       if (callback) {
         return callback(Meducation.userGroups);
       }
     } else {
       return $.getJSON('http://localhost:3000/api/v1/my/groups').done(function(groups) {
         Meducation.userGroups = groups;
         if (callback) {
           return callback(groups);
         }
       });
     }
   };

   Groups.setupForm = function() {
     return $('#group_name').blur(function() {
       var url;
       if ($('#group_url').val() === "") {
         url = $('#group_name').val();
         url = url.replace(/[^a-zA-Z0-9\-\_\s]/g, "");
         url = url.replace(/\s+/g, "-");
         url = url.toLowerCase();
         return $('#group_url').val(url);
       }
     });
   };

   Groups.setupInvites = function() {
     var _i, _results;
     _results = [];
     for (_i = 1; _i <= 3; _i++) {
       _results.push(this.addInvite());
     }
     return _results;
   };

   Groups.addInvite = function() {
     var input, invite, name, names, status,
       _this = this;
     names = ["bob", "jill", "chris", "kate", "andy", "nick", "dave", "juliet", "laura", "kate", "rachel"];
     name = names[Math.floor(Math.random() * names.length)];
     invite = $('<div class="invite"/>');
     status = $("<span class='status'><span class='tick'/></span>");
     input = $("<input name='emails[]' placeholder='" + name + "@example.com' type='email' value='' class='email'>");
     input.keyup(function() {
       if (input.val() !== "") {
         status.addClass("valid");
         if ($('#invites_form .invites .status:not(.valid)').length < 2) {
           return _this.addInvite();
         }
       } else {
         return status.removeClass("valid");
       }
     });
     invite.append(status).append(input);
     return $('#invites_form .invites').append(invite);
   };

   return Groups;

 })();


Meducation.BoardItemManager = (function() {
  function BoardItemManager(item_type, item_id, pinOnSelect) {
    var _this = this;
    this.item_type = item_type;
    this.item_id = item_id;
    this.pinOnSelect = pinOnSelect != null ? pinOnSelect : true;
    this.togglePin = __bind(this.togglePin, this);
    this.toggleSection = __bind(this.toggleSection, this);
    this.toggleNewBoard = __bind(this.toggleNewBoard, this);
    this.appendBoard = __bind(this.appendBoard, this);
    this.$elem = $('<div class="w-board-item-manager"/>');
    this.fetchForItem(function(allBoards) {
      return Meducation.Groups.fetchUserGroups(function(userGroups) {
        var $section, $ul, board, cssClass, group, i, index, section, sections, _i, _j, _k, _len, _len1, _len2, _name, _ref;
        sections = {
          0: {
            title: "Personal",
            boards: [],
            owner_type: "User",
            owner_id: Meducation.userId
          }
        };
        for (_i = 0, _len = userGroups.length; _i < _len; _i++) {
          group = userGroups[_i];
          sections[_name = group.id] || (sections[_name] = {
            title: group.name,
            boards: [],
            owner_type: "Group",
            owner_id: group.id
          });
        }
        for (_j = 0, _len1 = allBoards.length; _j < _len1; _j++) {
          board = allBoards[_j];
          if (board.owner_type === "Group") {
            sections[board.owner_id].boards.push(board);
          } else {
            sections[0].boards.push(board);
          }
        }
        index = 0;
        for (i in sections) {
          section = sections[i];
          cssClass = index === 0 ? 'open' : '';
          $section = $("<div class='section " + cssClass + "'><div class='section-title'>" + section.title + "</div><ul/></div>").appendTo(_this.$elem);
          $ul = $section.children('ul');
          _ref = section.boards;
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            board = _ref[_k];
            _this.appendBoard($ul, board);
          }
          $section.append("<div class=\"field new-board-field\" style=\"display:none\">\n  <input type=\"text\" class=\"new-board-name\" name=\"board_name\"/><button class=\"new-board-field pure-button primary\">Go</button>\n</div>\n<div class=\"new-board-button\">Create new board</div>");
          $section.children('.new-board-field').data('owner_type', section.owner_type);
          $section.children('.new-board-field').data('owner_id', section.owner_id);
          $section.children('.new-board-button').click(_this.toggleNewBoard);
          index++;
        }
        _this.$elem.find('.section-title').click(_this.toggleSection);
        return _this.$elem.find('li').click(_this.togglePin);
      });
    });
  }

  BoardItemManager.prototype.appendBoard = function($ul, board) {
    var cssClass;
    cssClass = board.has_item ? 'checked' : '';
    return $ul.append("<li data-board-id='" + board.id + "' class='" + cssClass + "'>" + board.name + "</li>");
  };

  BoardItemManager.prototype.toggleNewBoard = function(e) {
    var $button, $field, $go, $section,
      _this = this;
    $button = $(e.target);
    $field = $button.prev();
    $section = $button.parent();
    $go = $field.find('button');
    $button.hide();
    $field.show();
    return $go.click(function() {
      var name, owner_id, owner_type;
      owner_type = $field.data('owner_type');
      owner_id = $field.data('owner_id');
      name = $field.find('.new-board-name').val();
      _this.pinItemToNewBoard(owner_type, owner_id, name, function(board) {
        var $ul;
        $ul = $section.find('ul');
        return _this.appendBoard($ul, board);
      });
      $field.hide();
      return $button.show();
    });
  };

  BoardItemManager.prototype.toggleSection = function(e) {
    var $section;
    $section = $(e.target).parent();
    this.$elem.find('.section').not($section).removeClass('open');
    return $section.toggleClass('open');
  };

  BoardItemManager.prototype.togglePin = function(e) {
    var $li, boardId;
    $li = $(e.target);
    boardId = $li.data('board-id');
    if ($li.hasClass('checked')) {
      this.unpinItem(boardId);
    } else {
      this.pinItem(boardId);
    }
    return $li.toggleClass('checked');
  };

  BoardItemManager.prototype.pinItem = function(boardId) {
    var values;
    if (this.pinOnSelect) {
      return $.post("http://localhost:3000/api/v1/board_items", {
        board_item: {
          item_type: this.item_type,
          item_id: this.item_id,
          board_id: boardId
        }
      });
    } else {
      values = $('#media_file_board_ids').val().split(',');
      if (values[0] === '') {
        values = [];
      }
      values.push(boardId);
      return $('#media_file_board_ids').val(values.join(','));
    }
  };

  BoardItemManager.prototype.pinItemToNewBoard = function(ownerType, ownerId, name, callback) {
    var _this = this;
    return $.post("http://localhost:3000/api/v1/boards", {
      board: {
        owner_type: ownerType,
        owner_id: ownerId,
        name: name
      }
    }).done(function(response) {
      var board;
      board = response.board;
      board.has_item = true;
      callback(board);
      return $.post("http://localhost:3000/api/v1/board_items", {
        board_item: {
          item_type: _this.item_type,
          item_id: _this.item_id,
          board_id: board.id
        }
      });
    });
  };

  BoardItemManager.prototype.unpinItem = function(boardId) {
    var data, req, values;
    data = {
      board_item: {
        item_type: this.item_type,
        item_id: this.item_id,
        board_id: boardId
      }
    };
    if (this.pinOnSelect) {
      return req = $.ajax({
        url: "http://localhost:3000/api/v1/board_items",
        data: data,
        type: "DELETE"
      });
    } else {
      values = $('#media_file_board_ids').val().split(',');
      values.splice(values.indexOf(boardId), 1);
      return $('#media_file_board_ids').val(values.join(','));
    }
  };

  BoardItemManager.prototype.fetchForItem = function(callback) {
    return $.getJSON("http://localhost:3000/api/v1/my/boards.json", {
      item_id: this.item_id,
      item_type: this.item_type
    }).done(callback);
  };

  return BoardItemManager;

})();