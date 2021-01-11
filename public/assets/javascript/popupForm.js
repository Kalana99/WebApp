const form_name_array = ["ADD/DROP Requests", "Submitting Requests", "Repeat Exam Requests"];

function openForm(form_num){
    if (document.getElementsByClassName("form-popup")[form_num].style.display == "block"){
        document.getElementsByClassName("form-popup")[form_num].style.display = "none";
    }
    else{
        document.getElementsByClassName("form-popup")[form_num].style.display = "block";
        document.getElementsByTagName("h2")[0].innerHTML = form_name_array[form_num];
        //haminena aulak thyenwa yata line eke
        document.getElementsByTagName("option")[0].innerHTML = form_name_array[form_num];
        // console.log(document.getElementsByTagName("option")[0].innerHTML = form_name_array[form_num]);
    }
}