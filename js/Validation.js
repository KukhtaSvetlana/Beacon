var form = document.querySelector('.regform');
var	elements = form.querySelectorAll('.text_field'),
	// объект кнопки, на который повесим обработчик события начала валидации формы
	// и отправки её значений на сервер
	btn	= form.querySelector('.next_btn1');
	// паттерны RegExp о которых было написано выше
	patternName	= /^[а-яёА-ЯЁ\s]+$/,
	patternMail	= /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
	patternSpam	= /[^\<\>\[\]%\&'`]+$/,
	// массив с сообщениями об ошибке
	// эти сообщения можно разместить и внутри кода валидации, но лучше,
	// если они будут находиться в одном месте
	// это облегчит их редактирование, а так же проще будет прописать новые,
	// если решите добавить критерии валидации
	errorMess	= [
		'Незаполненное поле ввода', // [0]
		'Введите Ваше реальное имя', // [1]
		'Укажите Ваш электронную почту', // [2]
		'Неверный формат электронной почты', // [3]
		'Укажите тему сообщения', // [4]
		'Напишите текст сообщения', // [5]
		'Ваше сообщение похоже на спам, уберите специальные символы.' // [6]
	],
	// флаг ошибки валидации
	iserror		= false;
btn.addEventListener('click', validForm);
	function validForm(e) {
		var formVal = getFormData(form),
		error;
 
	for (var property in formVal) {
		error = getError(formVal, property);
		if (error.length != 0) {
			// устанавливаем флаг ошибки
			iserror = true;
			// вызываем функцию отображения текста ошибки
			showError(property, error);
		}
	}
 
	// если флаг ошибки сброшен (iserror == false)
	if (!iserror) {
		// вызываем функцию отправляющую данные формы,
		// хранящиеся в объекте formVal, на сервер
		sendFormData(formVal);
	}
} 
function getFormData(form) {
	// объект, куда будут записывать данные в формате 'имя_поля': 'значение'
	var controls = {};
	// если по какой-то причине в 'form' полей не нашлось
	// вернём в функцию validForm пустое значение
	if (!form.elements) return '';
	// переберём в цикле поля формы, получим от каждого поля его значение,
	// запишем полученные данные в 'controls'
	var ii = form.elements;
	for (var i = 0; i < ii.length; i++) {
		var element = form.elements[i];
		// т.к. имя поля находятся в верхнем регистре (так их записывает JS
		// при создании объекта 'form'), переведём имя элемента в нижний регистр
		// и проверим, не является ли текущий элемент кнопкой, значение которой
		// нас не интересует
		if ( element.name != "") {
				controls[element.name]= element.value;
		}
	} 
	return controls;
}
function getError(formVal, property) {
	// создаём литеральный объект validate
	// каждому свойству литерального объекта соответствует анонимная функция, в которой
	// длина значения поля, у которого атрибут 'name' равен 'property', сравнивается с 0,
	// а само значение - с соответствующим паттерном
	// если сравнение истинно, то переменной error присваивается текст ошибки
 
	var error = '',
		validate = {
			'FirstName': function() {
				if (formVal.FirstName.length == 0 || patternName.test(formVal.FirstName) == false) {
					error = errorMess[1];
				}
			},
			'LastName': function() {
				if (formVal.LastName.length == 0 || patternName.test(formVal.LastName) == false) {
					error = errorMess[1];
				}
			},
			'email': function() {
				if (formVal.email.length == 0) {
					error = errorMess[2];
				} else if (patternMail.test(formVal.email) == false) {
					error = errorMess[3];
				}
			},
			'subject': function() {
				if (formVal.subject.length == 0) {
					error = errorMess[4];
				} else if (patternSpam.test(formVal.subject) == false) {
					error = errorMess[6];
				}
			},
			'textmess': function() {
				if (formVal.textmess.length == 0) {
					error = errorMess[5];
				} else if (patternSpam.test(formVal.textmess) == false) {
					error = errorMess[6];
				}
			}
		};
 
	// если после вызова анонимной функции validate[property]() переменной error
	// было присвоено какое-то значение, то это значение и возвращаем,
	// в противном случае вернётся пустая строка, которая была присвоена изначально
	// перед объявлением литерального объекта validate
	validate[property]();
	return error;
}

function showError(property, error) {
	// получаем объект элемента, в который введены ошибочные данные
	var formElement = form.querySelector('[name=' + property + ']'),
	// с помощью DOM-навигации находим <span>, в который запишем текст ошибки
		errorBox	= formElement.parentElement.nextElementSibling;
 
	// добавляем класс к <input>
	formElement.classList.add('form-control_error');
	formElement.setCustomValidity("" + error);
	// записываем текст ошибки в <span> 
	errorBox.innerHTML = error;
	// делаем <span> видимым
	errorBox.style.display = 'block';
}