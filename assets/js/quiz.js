$(document).ready(function () {
    var count = 0;
    // const id = '<%= quiz.id %>'
    const parameters = process.env.PORT ? process.env.PORT: '5000';

    $("#submitQuiz").on('click', (e) => {
        e.preventDefault();
        count++;
        console.log(count);


        // $.ajax({
        //     url : `http://localhost:`+parameters+`/api/quiz/`,
        //     method : "GET",
        //     // contentType: "application/json",
        //     data : {count: count},
        //     dataType: "JSON",

        //     success: function (data, status, xhr) {
        //         console.log("quizData: ");
        //     },
        //     error: function (jqXhr, textStatus, errorMessage) {
        //         console.log("failed: ", errorMessage);
        //     }
        // })   
    })

});