// doc ready function
$(function(){
  console.log('document loaded');
  // //get all the tasks from the DB
  getTasks();
  //
  // // listen for a submit event on the form
  $('#task-form').on('submit', addTask);

  //if you click on somethingin book-list and it has the class of "save" run updateBook
  // $('#task-list').on('click', '.save', updateTask);
  $('#task-list').on('click', '#delete', deleteTask);
  $('#completedTasks').on('click', '#delete', deleteTask);
  $('#task-list').on('click', '#completed', completeTask);
});
//
function getTasks() {
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: displayTasks
  });
}
//
function displayTasks(tasks) {
  console.log('Got tasks from the server', tasks);
  $('#task-list').empty();
  $('#completedTasks').empty();
  tasks.forEach(function(task){
    if (task.done == null) {

      var $li = $('<li></li>');
      $li.data('task', task.task)
      // var $div = $('<div class = "tasks"></div>');
      //input type = "text" name = "title" va;ue = "infinite jest"
      $li.append('<p class = task>' + task.task + '<p/>');

      //create a button and save the book ID as data on that button
      // var $saveButton = $('<button class = "save">Update</button>');
      // // //assocaiting the button with the book ID so we know which one is being saved
      // $saveButton.data('id', task.id);
      // $form.append($saveButton);

      var $deleteButton = $('<button class = "tasks" id = "delete">Delete</button>');
      $deleteButton.data('id', task.id);
      $li.append($deleteButton);

      var $completedButton = $('<button class = "tasks" id = "completed">Completed!</button>');
      $completedButton.data('id', task.id);
      $li.append($completedButton);

      // $li.append($div);
      $('#task-list').append($li);
    } else {
      var $li = $('<li></li>');

      //input type = "text" name = "title" value = "infinite jest"
      $li.append('<p class = "done">' + task.task + '<p/>');

      var $deleteButton = $('<button class = "tasks" id = "delete">Delete</button>');
      $deleteButton.data('id', task.id);
      $li.append($deleteButton);

      $('#completedTasks').append($li);
    }
  });
}

function addTask(event) {
  // prevent browser from refreshing
  event.preventDefault();

  // get the info out of the form
  var formData = $(this).serialize();
  $(this).closest('input').val(''); 
  // send data to server
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
        //the url is made from the data on the book itself
        url: '/tasks/' + $(this).data('id'),
        type: 'DELETE',
        success: getTasks
      });
    } else {
      console.log("User cancelled delete");
    };
};
