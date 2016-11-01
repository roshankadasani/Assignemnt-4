$("#lets_play_btn").click(function(){
  alert("Works");
  $("#bg_img").hide(700);

    $.ajax({
        method: "GET",
        url: "http://localhost:3000/question",
        crossDomain : true,
        dataType: "json",
        })

        .done(function( msg ) {

            //console.log(msg);
            if(msg.answer==false){
                msg.answer="false";
            }
            $("#allQueId").show();
            $("#score_btn").show();
            $("#que_btn_add").show();
            $("#que_add").hide();
            $("#lets_play_btn").hide();

        var displayQuestions = function(element, index, array){

            var $item = $('<div id="allQueId" class="btn">' +
                        '<label>Question : </label><input type="text" name="que" id="queId'+ index +'"><br>' +
                        '<label>Answer : </label><input type="text" name="ans" id="ansId'+ index +'"><br></div>' +
                        '<input type="button" value="Send" id="sendBtnId'+ index + '"><br>');

            $("#show_que").append($item);
         $("#queId" + index).val(array[index].question);

        }

        msg.forEach(displayQuestions);


        var getAnswers = function(element, index, array){

            $("#sendBtnId" + index).click(function(){
                alert("Your Answer has been Recorded..!");

                var ans = $("#ansId" + index).val();
                var ansId = array[index]._id;
                var actualAns = array[index].answer;

               // console.log(ans);
                //console.log(ansId);

                var data = {
                    "ans_id" : ansId,
                    "possibleAns" : ans,
                    "answer" : actualAns
                }
                var dataJSON = JSON.stringify(data);
               // console.log(JSON.stringify(data));
                $.ajax({

                    method: "POST",
                    url: "http://localhost:3000/answer",
                    crossDomain : true,
                    dataType: "json",
                    data : data
                    })

                    .done(function( msg ) {

                        //console.log(msg);
                        if(msg.answer==false){
                            msg.answer="false";
                        }


                    })

            });
        }
        msg.forEach(getAnswers);

    });
});
