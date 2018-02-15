'use strict';


let serverCallCategory = (function () {

    function populateCategories(categories) {
        const element = categories.map(category => {
            return `<a class="category category-${category.name}" data-category="${category.name}" data-id="${category._id}">${category.name}</a>`;
        });
        $('.categories-list').append(element);
        return;
    }

    function _ajaxGetCategories() {
        $.ajax('/categories', {
            method: 'GET',
            success: function (obj) {
                populateCategories(obj);
                return;
            },
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return {
        ajaxGetCategories: _ajaxGetCategories,
    };
})();

let serverCallContents = (function () {

    function clearPreviousConents() {
        $('.contents').find('.content').remove();
        return;
    }

    function clearButtons() {
        $('.contents').find('.completedContents').remove();
        return;
    }

    function clearForm() {
        $('.contents').find('.add-content-form').remove();
        return;
    }

    function clearAddContentsLink() {
        $('.contents').find('.add-content-div').remove();
        return;
    }

    function appendElementsUtil(element) {
    const constaddContent = `<div class="add-content-div"><a class="add-content-link">+ Add task</a></div>`;
        const formElement = `<form class="add-content-form remove-display" action="/">
           <fieldset class="add-content-form-fieldset">
               <textarea rows="4" cols="50" name="comment" placeholder="e.g. Remind me About something" class="add-content-form-textArea" required></textarea>
               <input type="submit" class="add-content-form-submit" value="Add"/>
               <a class="add-content-form-cancel"><u>Cancel</u></a>
           </fieldset>
        </form>`;
        element.push(constaddContent);
        element.push(formElement);
        element.push(`<input type="button" class="completedContents" value="show-completed"/>`);
        return;
    }

    function populateContents(contents, categoryVal, id) {
        clearPreviousConents();
        $('.contents').attr('data-categoryname', categoryVal);
        $('.contents').attr('data-categoryid', id);
        $('.contents-heading').text(`${categoryVal}`);
        const element = contents.map(content => {
            return `<li class="content" data-contentid="${content._id}">
                        <table class="content-table">
                            <tbody>
                                <tr class="content-table-contents">
                                    <td class="content-table-checkbox"><div class="content-table-checkbox-div"><div class="content-table-checkbox-tick remove-display"></div></div></td>
                                    <td class="content-table-text"><div class="content-table-text-div">${content.content}</div></td>
                                    <td class="content-table-meatball"><img class="content-table-meatball-div" src="files/meatball.png" alt="meatball menu icon"></td>
                                </tr>
                                <tr class="content-buttons-row remove-display">
                                    <td></td>
                                    <td class="content-table-edit">
                                        <input type="button" value="Edit" class="content-buttons content-table-edit-button"/>
                                        <input type="button" value="Save" class="content-buttons content-table-save-button remove-display"/>
                                        <input type="button" value="Delete" class="content-buttons content-table-delete-button"/>
                                        <a class="content-buttons content-table-cancel-link"><u>cancel</u></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

</li>`;
        });
        appendElementsUtil(element);
        $('.contents-list').append(element);
        return;
    }

    function _getContents() {
        $('.categories').on('click', '.category', function () {
            clearAddContentsLink();
            clearButtons();
            clearForm();
            let categoryVal = $(this).data('category');
            let id = $(this).data('id');
            _ajaxGetContents(categoryVal, id);
        });
        return;
    }

    function _ajaxGetContents(categoryVal, id) {
        $.ajax('/contents', {
            method: 'GET',
            data: {
                categoryid: id,
                completed: false
            },
            success: function (obj) {
                populateContents(obj, categoryVal, id);
                return;
            },
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return {
        getContents: _getContents,
    };
})();


let handleCompletedContents = (function () {

    function _removeCompletedContents() {
        $('.contents-list').on('click', '.content-table-checkbox', function () {
            let contentVal = $(this).closest('.content-table').find('.content-table-text-div').text();
            let id = $(this).closest('.content').attr('data-contentid');
            $(this).closest('.content-table').remove();
            const updatedObj = {
                _id: id,
                content : contentVal,
                completed: true
            };
            _ajaxChangeDocument(updatedObj);
        });
        return;
    }

    function _ajaxChangeDocument(updatedObj) {
        $.ajax('/contents', {
            method: 'PUT',
            data: JSON.stringify(updatedObj),
            success: function (obj) {
                return;
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return {
        removeCompletedContents: _removeCompletedContents
    }

})();

let handleShowCompletedContents = (function () {

    function _showCompletedContents() {
        $('.contents').on('click', '.completedContents', function () {
            let categoryid = $('.contents').attr('data-categoryid');
            _ajaxShowCompleted(categoryid);
        });
        return;
    }

    function _ajaxShowCompleted(categoryid) {
        $.ajax('/contents', {
            method: 'GET',
            data: {
                categoryid: categoryid,
                completed: true
            },
            success: function (obj) {
                console.log(obj)
            },
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return {
        showCompletedContents: _showCompletedContents
    }

})();

let handleAddContents = (function () {
    function _addContents() {
        $('.contents').on('submit', '.add-content-form', function (event) {
            $(this).addClass('remove-display');
            event.preventDefault();
            let contentValue = $('.add-content-form-textArea').val();
            let id = $('.contents').attr('data-categoryid');
            let categoryName = $('.contents').attr('data-categoryname');
            $('.add-content-form-textArea').val('');
            _ajaxAddContents(contentValue, id, categoryName);
        });
    }

    function successhelp() {
        setTimeout(function () {
            $('.success').removeClass('success-Animate');
            $('.success').text('');
        }, 3000);
    }

    function _displaySuccess(categoryName, callback) {
        $('.success').addClass('success-Animate');
        $('.success').text(`Success!!! Added Item to "${categoryName} Category"`);
        callback();
        return;
    }

    function appendElements(obj, contentValue) {
        const element = `<li class="content" data-contentid="${obj._id}">
            <table class="content-table">
                <tbody>
                    <tr class="content-table-contents">
                        <td class="content-table-checkbox"><div class="content-table-checkbox-div"><div class="content-table-checkbox-tick remove-display"></div></div></td>
                        <td class="content-table-text"><div class="content-table-text-div">${contentValue}</div></td>
                        <td class="content-table-meatball"><img class="content-table-meatball-div" src="files/meatball.png" alt="meatball menu icon"></td>
                    </tr>
                    <tr class="content-buttons-row remove-display">
                        <td></td>
                        <td class="content-table-edit">
                            <input type="button" value="Edit" class="content-buttons content-table-edit-button"/>
                            <input type="button" value="Save" class="content-buttons content-table-save-button remove-display"/>
                            <input type="button" value="Delete" class="content-buttons content-table-delete-button"/>
                            <a class="content-buttons content-table-cancel-link"><u>cancel</u></a>
                        </td>
                    </tr>
                </tbody>
            </li>`;
        $(element).insertBefore($('.contents').find('.add-content-div'));
        return;
    }

    function _ajaxAddContents(contentValue, id, categoryName) {
        const obj = {
            categoryid: id,
            content: contentValue,
            completed: false
        };
        $.ajax('/contents', {
            method: 'POST',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (obj) {
                appendElements(obj, contentValue);
                _displaySuccess(categoryName, successhelp);
            },
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return {
        addContents: _addContents
    }

})();


let addCategories = (function () {

    function _displayAddCategory() {
        $('.add-category-link').click(function () {
            $('.add-categories-form').toggle('remove-display');
        });
        return;
    }

    function _addCategory() {
        $('.add-categories-form').submit(function (event) {
            event.preventDefault();
            let categoryVal = $('.add-categories-form-text').val();
            _ajaxAddCategory(categoryVal);
        });
        return;
    }

    function _addNewCategory(obj) {
        const element = `<a class="category category-${obj.name}" data-category="${obj.name}" data-id="${obj._id}">${obj.name}</a>`;
        $('.categories').find('.categories-list').append(element);
        return;
    }

    function errorhelp() {
        setTimeout(function () {
            $('.error').removeClass('error-Animate');
            $('.error').text('');
        }, 3000);
    }

    function _displayError(name, callback) {
        $('.error').addClass('error-Animate');
        $('.error').text(`ERROR!!! "${name}" already Exists`);
        callback();
        return;
    }

    function _ajaxAddCategory(categoryVal) {
        const obj = {
            name: categoryVal
        };
        $.ajax('/categories', {
            method: 'POST',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (obj) {
                _addNewCategory(obj);
            },
            error: function (err) {
                let errMessage = JSON.parse(err.responseText);
                _displayError(errMessage.op.name, errorhelp);
            }
        });
    }

    return {
        displayAddCategory: _displayAddCategory,
        addCategory: _addCategory
    }

})();

let handleEditContents = (function () {
 let text;

    function editSuccessHelp() {
        setTimeout(function () {
            $('.edit-success').removeClass('edit-success-Animate');
            $('.edit-success').text('');
        }, 3000);
    }

    function _displaySuccessEdit(callback) {
        $('.edit-success').addClass('edit-success-Animate');
        $('.edit-success').text(`Successfully !! Edited Task`);
        callback();
        return;
    }

    function _editContentsUtil (target) {
        $(target).closest('.content-table').find('.content-table-text-div').attr('contenteditable','true');
        $(target).closest('.content-table').find('.content-table-text-div').addClass('border');
        $(target).closest('.content-table').find('.content-table-save-button').removeClass('remove-display');
        $(target).addClass('remove-display');
        $(target).closest('.content-table').find('.content-table-save-button').click(function(event){
            event.stopImmediatePropagation();
            $(this).closest('.content-table').find('.content-table-text-div').removeClass('border');
            $(this).closest('.content-buttons-row').addClass('remove-display');
            $(this).closest('.content-table').find('.content-table-text-div').removeAttr('contenteditable');
            $(target).removeClass('remove-display');
            $(this).addClass('remove-display');
            let updatedText = $(target).closest('.content-table').find('.content-table-text-div').text();
            let contentId = $(target).closest('.content').attr('data-contentid');
            _ajaxEditContents(updatedText, contentId);
        });
    }

    function _handleCancel() {
        $('.contents-list').on('click', '.content-table-cancel-link', function(){
            if(text){
                $(this).closest('.content-table').find('.content-table-text-div').text(text);
            }
            $(this).closest('.content-table').find('.content-table-save-button').addClass('remove-display');
            $(this).closest('.content-table').find('.content-table-edit-button').removeClass('remove-display');
            $(this).closest('.content-table').find('.content-table-text-div').removeClass('border');
            $(this).closest('.content-table').find('.content-buttons-row').addClass('remove-display');
            text ='';
        });
    }

    function _editContents() {
        $('.contents-list').on('click', '.content-table-edit-button', function () {
            text = $(this).closest('.content-table').find('.content-table-text-div').text();
            _editContentsUtil(this);
        });
    }

    function _ajaxEditContents (updatedText, contentId) {
        const updatedObj={
                _id: contentId,
                content: updatedText,
                completed: false
        };
        $.ajax('/contents', {
            method: 'PUT',
            data: JSON.stringify(updatedObj),
            success: function () {
                _displaySuccessEdit(editSuccessHelp);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return {
        handleCancel :_handleCancel,
        editContents: _editContents,
    }
})();

let handleDeleteContents = (function () {
    function _deleteContent() {
        $('.contents-list').on('click', '.content-table-delete', function () {
            let id = $(this).closest('.content').attr('data-contentid');
            $(this).closest('tr').remove();
            _ajaxDeleteContent(id)
        });
        return;
    }

    function _ajaxDeleteContent(id){
        $.ajax('/contents',{
            method: 'DELETE',
            data: JSON.stringify({_id:id}),
            success: function () {
                return;
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (err) {
                console.log(err);
                throw err;
            }
        });

    }

    return {
        deleteContent:_deleteContent
    }

})();


function handleMeatBallClick() {
    $('.contents-list').on('click', '.content-table-meatball', function(){
        if($(this).closest('.content-table').find('.content-buttons-row').hasClass('remove-display')){
            $(this).closest('.content-table').find('.content-buttons-row').removeClass('remove-display')
        }else{
            $(this).closest('.content-table').find('.content-buttons-row').addClass('remove-display');
        }
    });
    return;
}



function handleTick() {
    $('.contents-list').on('mouseenter','.content-table-checkbox' , function(){
        $(this).closest('.content-table').find('.content-table-checkbox-tick').removeClass('remove-display');
    }).on('mouseleave', '.content-table-checkbox', function() {
        $(this).closest('.content-table').find('.content-table-checkbox-tick').addClass('remove-display');
    });
    return;
}

function handleShowForm(){
    $('.contents-list').on('click', '.add-content-div', function() {
        $(this).closest('.contents-list').find('.add-content-form').removeClass('remove-display');
    });
}

function handleCancelForm(){
    $('.contents-list').on('click', '.add-content-form-cancel', function(){
       $(this).closest('.add-content-form').find('textArea').val('');
       $(this).closest('.add-content-form').addClass('remove-display');
    });
}

function main() {
    serverCallCategory.ajaxGetCategories();
    serverCallContents.getContents();
    handleCompletedContents.removeCompletedContents();
    handleShowCompletedContents.showCompletedContents();
    handleAddContents.addContents();
    handleEditContents.editContents();
    addCategories.displayAddCategory();
    addCategories.addCategory();
    handleMeatBallClick();
    handleTick();
    handleShowForm();
    handleCancelForm();
    handleEditContents.handleCancel();
    handleDeleteContents.deleteContent();
    return;
}

$(main());
