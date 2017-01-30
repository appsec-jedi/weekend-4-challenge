$(function(){
  console.log('document loaded');

  getTasks();

  $('#task-form').on('submit', addTask);

  $('#task-list').on('click', '#delete', deleteTask);
  $('#completedTasks').on('click', '#delete', deleteTask);
  $('#task-list').on('click', '#completed', completeTask);
});

function getTasks() {
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: displayTasks
  });
}

function displayTasks(tasks) {
  console.log('Got tasks from the server', tasks);
  $('#task-list').empty();
  $('#completedTasks').empty();
  tasks.forEach(function(task){
    if (task.done == null) {

      var $li = $('<li></li>');
      $li.data('task', task.task)

      $li.append('<p class = task>' + task.task + '<p/>');

      // var $saveButton = $('<button class = "save">Update</button>');
      // $saveButton.data('id', task.id);
      // $form.append($saveButton);

      var $deleteButton = $('<button class = "tasks btn-danger" id = "delete">Delete</button>');
      $deleteButton.data('id', task.id);
      $li.append($deleteButton);

      var $completedButton = $('<button class = "tasks btn-success" id = "completed">Completed!</button>');
      $completedButton.data('id', task.id);
      $li.append($completedButton);


      $('#task-list').append($li);
    } else {
      var $li = $('<li></li>');


      $li.append('<p class = "done">' + task.task + '<p/>');

      var $deleteButton = $('<button class = "tasks btn-danger" id = "delete">Delete</button>');
      $deleteButton.data('id', task.id);
      $li.append($deleteButton);

      $('#completedTasks').append($li);
    }
  });
}

function addTask(event) {

  event.preventDefault();

  var formData = $(this).serialize();
  $(this).closest('input').val('');
  $.ajax({
    url: '/tasks',
    type: 'POST',
    data: formData,
    success: getTasks
  });

}

// function updateTask(event) {
//   event.preventDefault();
//
//   // var $button = $(this);
//   var $form = $(this).closest('form');
//
//   var data = $form.serialize();
//   var done = "";
//
//   data = data+"&done="+done;
//   console.log("data is: ", data);
//   $.ajax({
//     //the url is made from the data on the book itself
//     url: '/tasks/' + $(this).data('id'),
//     type: 'PUT',
//     data: data,
//     success: getTasks
//   });
// }
function completeTask(event){
  event.preventDefault();
  // var $form = $(this).closest('form');
  var $task = $(this).closest('li');
  var $id = $(this).data('id')
  console.log("id: ", $id);
  var data = $task.data('task');
  console.log("data: ", data);
  var completed = "task="+data+"&done=yes";
  console.log(completed);
  alert("Nice job!")
  $.ajax({
    url:'/tasks/' + $(this).data('id'),
    type: 'PUT',
    data: completed,
    success: getTasks
  });
}

function deleteTask(event) {
  event.preventDefault();
  var confirmation = confirm("Are you sure you want to delete this task?");
  if (confirmation == true){
      $.ajax({
        url: '/tasks/' + $(this).data('id'),
        type: 'DELETE',
        success: getTasks
      });
    } else {
      console.log("User cancelled delete");
    };
};
