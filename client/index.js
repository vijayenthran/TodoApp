'use strict';


let serverCallCategory = (function () {

    function _populateCategories(categories) {
        const element = categories.map(category=>{
            if(category.name === 'Today' || category.name === 'Personal' || category.name ==='Errands' || category.name ==='Movies to Watch' || category.name ==='Groceries'){
                return `<table class="category-table">
            <tbody class="category-table-body">
                <tr class="category-table-category">
                    <td class="category-table-category-name"><a class="category category-${category.name}" data-category="${category.name}" data-id="${category._id}">${category.name}</a></td>
                    <td class="category-table-category-meatball remove-display"><img class="category-table-meatball-div" src="files/meatball.png" alt="meatball menu icon"></td>
                </tr>
                <tr class="category-buttons-row remove-display">
                    <td class="category-table-edit">
                        <input type="button" value="Edit" class="category-buttons category-table-edit-button"/>
                        <input type="button" value="Save" class="category-buttons category-table-save-button remove-display"/>
                        <input type="button" value="Delete" class="category-buttons category-table-delete-button"/>
                        <a class="category-buttons category-table-cancel-link"><u>cancel</u></a>
                    </td>
                </tr>
            </tbody>
          </table>`
            }else{
                return `<table class="category-table">
            <tbody class="category-table-body">
                <tr class="category-table-category">
                    <td class="category-table-category-name"><a class="category category-${category.name}" data-category="${category.name}" data-id="${category._id}">${category.name}</a></td>
                    <td class="category-table-category-meatball"><img class="category-table-meatball-div" src="files/meatball.png" alt="meatball menu icon"></td>
                </tr>
                <tr class="category-buttons-row remove-display">
                    <td class="category-table-edit">
                        <input type="button" value="Edit" class="category-buttons category-table-edit-button"/>
                        <input type="button" value="Save" class="category-buttons category-table-save-button remove-display"/>
                        <input type="button" value="Delete" class="category-buttons category-table-delete-button"/>
                        <a class="category-buttons category-table-cancel-link"><u>cancel</u></a>
                    </td>
                </tr>
            </tbody>
          </table>`
            }

        });
        $('.categories-list').append(element);
        $('.category-menu-category-list').append(element);
        return;
    }

    function _ajaxGetCategories() {
        $.ajax('/categories', {
            method: 'GET',
            success: function (obj) {
                $('.categories-list').find('.category-table').remove();
                $('.contents').find('.completedContents').remove();
                $('.latest-created-Categories').find('.latest-created-Categories-content').remove();
                $('.latest-updated-Categories').find('.latest-updated-Categories-content').remove();
                _populateCategories(obj);
                let categoryid = $('.categories-list').find('.category-Today').attr('data-id');
                serverCallContents.ajaxGetContents('Today', categoryid);
                showFilters.ajaxFilters();
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

    function appendElementsUtil(element) {
        const formElement = `<form class="add-content-form remove-display" action="/">
           <fieldset class="add-content-form-fieldset">
               <textarea rows="4" cols="50" name="comment" placeholder="e.g. Remind me About something" class="add-content-form-textArea" required></textarea>
               <input type="submit" class="add-content-form-submit" value="Add"/>
               <a class="add-content-form-cancel"><u>Cancel</u></a>
           </fieldset>
        </form>`;
        return;
    }

    function populateContents(contents, categoryVal, id) {
        let contentsLen= contents.length;
        clearPreviousConents();
        $('.contents').attr('data-categoryname', categoryVal);
        $('.contents').attr('data-categoryid', id);
        $('.contents').attr('data-uncomplete', contentsLen);
        if(contentsLen === 0){
            $('.contents-heading').text(`No Tasks Present for "${categoryVal}", Click "+ Add Task" to create one`);
        }else{
            $('.contents-heading').text(`${categoryVal}`);
        }
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
            $('.add-content-link').removeClass('remove-display');
            $('.show-completed-link').removeClass('remove-display');
            $('.delete-warning-popup').addClass('remove-display');
            clearButtons();
            let categoryVal = $(this).attr('data-category');
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
        ajaxGetContents : _ajaxGetContents,
        getContents: _getContents,
    };
})();


let handleCompletedContents = (function () {

    function _removeCompletedContents() {
        $('.contents-list').on('click', '.content-table-checkbox', function () {
            let contentVal = $(this).closest('.content-table').find('.content-table-text-div').text();
            let id = $(this).closest('.content').attr('data-contentid');
            let categoryname= $(this).closest('.contents').attr('data-categoryname');
            $(this).closest('.content-table').remove();
            const updatedObj = {
                _id: id,
                categoryname :categoryname,
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
        $('.contents').on('click', '.show-completed-link', function () {
            let categoryid = $('.contents').attr('data-categoryid');
            _ajaxShowCompleted(categoryid);
        });
        return;
    }

    function displayShowCompleted (objs) {
        $('.completed-latest-contents').find('.completed-contents').remove();
        const element = objs.map(obj=>{
            return `<p class="completed-contents">${obj.content}</p>`
        });
        let categoryNAme = $('.completed-latest-contents').closest('.contents').attr('data-categoryname');
        $('.completed-latest-contents-head').text(`Completed Items of "${categoryNAme}"`);
        $('.completed-latest-contents').append(element);
        $('.completed-latest-contents').removeClass('remove-display');
        $('.outer-Overlay').removeClass('remove-display');
    }

    function _ajaxShowCompleted(categoryid) {
        $.ajax('/contents', {
            method: 'GET',
            data: {
                categoryid: categoryid,
                completed: true
            },
            success: function (obj) {
                displayShowCompleted(obj);
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
        $('.contents-list').append(element);
        return;
    }

    function _ajaxAddContents(contentValue, id, categoryName) {
        const obj = {
            categoryid: id,
            categoryname: categoryName,
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
                $('.contents-heading').text(categoryName);
                _displaySuccess(categoryName, successhelp);
            },
            error: function (err) {
                $('.contents-heading').text(`Content not added to ${categoryName}, Please contact Admin`);
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
            $('.add-categories-form').toggle('fast');
        });
        return;
    }

    function _addCategory() {
        $('.add-categories-form').submit(function (event) {
            event.preventDefault();
            let categoryVal = $('.add-categories-form-text').val();
            _ajaxAddCategory(categoryVal);
            $('.add-categories-form-text').val('');
        });
        return;
    }



    function _addNewCategory(obj) {
        const element = `    <table class="category-table">
            <tbody class="category-table-body">
                <tr class="category-table-category">
                    <td class="category-table-category-name"><a class="category category-${obj.name}" data-category="${obj.name}" data-id="${obj._id}">${obj.name}</a></td>
                    <td class="category-table-category-meatball"><img class="category-table-meatball-div" src="files/meatball.png" alt="meatball menu icon"></td>
                </tr>
                <tr class="category-buttons-row remove-display">
                    <td class="category-table-edit">
                        <input type="button" value="Edit" class="category-buttons category-table-edit-button"/>
                        <input type="button" value="Save" class="category-buttons category-table-save-button remove-display"/>
                        <input type="button" value="Delete" class="category-buttons category-table-delete-button"/>
                        <a class="category-buttons category-table-cancel-link"><u>cancel</u></a>
                    </td>
                </tr>
            </tbody>
          </table>`;
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
                console.log(err);
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
            let categoryName = $(target).closest('.contents').attr('data-categoryname');
            _ajaxEditContents(updatedText, contentId, categoryName);
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

    function _ajaxEditContents (updatedText, contentId, categoryName) {
        const updatedObj={
                _id: contentId,
                categoryname: categoryName,
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
        $('.contents-list').on('click', '.content-table-delete-button', function () {
            let id = $(this).closest('.content').attr('data-contentid');
            $(this).closest('.content-table').remove();
            _ajaxDeleteContent(id);
        });
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

let handleEditCategories = (function () {
    let text;
    function handleMaxCategory(textVal){
        if(textVal.length >=22){
            return 'longText';
        }else if(textVal.length <=1){
            return 'smallText'
        }
    }

    function warninghelp() {
        setTimeout(function () {
            $('.warning').removeClass('warning-Animate');
            $('.warning').text('');
        }, 3000);
    }

    function _warning(callback) {
        $('.warning').addClass('warning-Animate');
        $('.warning').text(`Warning!!! "Name should be between 1 and 22 Chars"`);
        callback();
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

    function _editCategory() {
        $('.categories-list').on('click', '.category-table-edit-button', function () {
            text = $(this).closest('.category-table').find('.category-table-category-name .category-temp').text();
            $(this).closest('.category-table').find('.category-table-category-name .category-temp').attr('contenteditable','true');
            $(this).closest('.category-table').find('.category-table-category-name .category-temp').addClass('border');
            $(this).closest('.category-table').find('.category-table-save-button').removeClass('remove-display');
            $(this).addClass('remove-display');
            _updateCategoryName()
        });
    }

    function _handleCancel() {
        $('.categories-list').on('click', '.category-table-cancel-link', function(){
            if(text){
                $(this).closest('.category-table').find('.category-table-category-name .category-temp').text(text);
            }
            $('.delete-warning-popup').addClass('remove-display');
            $(this).closest('.category-table').find('.category-table-save-button').addClass('remove-display');
            $(this).closest('.category-table').find('.category-table-edit-button').removeClass('remove-display');
            $(this).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('border');
            $(this).closest('.category-table').find('.category-table-category-name .category-temp').removeAttr('contenteditable');
            $(this).closest('.category-table').find('.category-buttons-row').addClass('remove-display');
            $(this).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('category-temp').addClass('category');
            text ='';
        });
    }

    function editSuccessHelp() {
        setTimeout(function () {
            $('.edit-success').removeClass('edit-success-Animate');
            $('.edit-success').text('');
        }, 3000);
    }

    function _displaySuccessEdit(callback) {
        $('.edit-success').addClass('edit-success-Animate');
        $('.edit-success').text(`Successfully !! Edited Category`);
        callback();
        return;
    }

    function clearElementsUtil(target){
        $(target).addClass('remove-display');
        $(target).closest('.category-table').find('.category-table-edit-button').removeClass('remove-display');
        $(target).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('border');
        $(target).closest('.category-table').find('.category-buttons-row').addClass('remove-display');
        $(target).closest('.category-table').find('.category-table-category-name .category-temp').removeAttr('contenteditable');
        $(target).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('category-temp').addClass('category');
        return;
    }

    function updateCategoryNameinConetentsSec(textVal){
        let contentHeadingVal =  $('.contents-heading').text();
        if(text === contentHeadingVal){
            $('.contents-heading').text(`${textVal}`);
            $('.categories-list').find(`.category-${text}`).addClass(`category-${textVal}`);
            $('.categories-list').find(`.category-${textVal}`).removeClass(`category-${text}`);
            $('.categories-list').find(`.category-${textVal}`).attr('data-category', textVal);
        }
        return;
    }


    function _updateCategoryName(){
        $('.categories-list').on('click', '.category-table-save-button', function () {
            let textVal = $(this).closest('.category-table').find('.category-table-category-name .category-temp').text();
            let id = $(this).closest('.category-table').find('.category-temp').attr('data-id');
            let lengthVal = handleMaxCategory(textVal);
            if(lengthVal === 'longText' || lengthVal === 'smallText'){
                if(text){
                    $(this).closest('.category-table').find('.category-table-category-name .category-temp').text(text);
                }
                _warning(warninghelp);
                clearElementsUtil(this);
                text = '';
                return;
            }else{
                updateCategoryNameinConetentsSec(textVal);
              _ajaxUpdateCategoryName(id, textVal, this);
                clearElementsUtil(this);
                text = '';
            }
        });
    }

    function _ajaxUpdateCategoryName(id, textVal, target){
        const updatedObj = {
            id :id,
            name: textVal
        };
        $.ajax('/categories', {
            method: 'PUT',
            data: JSON.stringify(updatedObj),
            success: function () {
                _displaySuccessEdit(editSuccessHelp);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (err) {
                if(text){
                    $(target).closest('.category-table').find('.category-table-category-name .category').text(text);
                }
                text='';
                console.log(err);
                _displayError(textVal, errorhelp);
            }
        });
    }

    return {
        handleCancel: _handleCancel,
        editCategory: _editCategory
    }
})();

let handleDeleteCategories = (function () {

    function _handleConfirmDelete(target, categoryId){
        _ajaxDeleteCategory(categoryId);
            $('.delete-warning-popup').addClass('remove-display');
            $(target).closest('.category-table').remove();
            $('.contents-heading').text('Category and Content Removed, Choose other Categories To Manage or Create New Category');
            $('.add-content-link').addClass('remove-display');
            $('.show-completed-link').addClass('remove-display');
            $('.contents-list').find('.content').remove();
            $('.contents-list').find('.add-content-form').remove();
            return;
    }

    function _handleCancelDelete(target){
        $('.delete-warning-popup').addClass('remove-display');
        $(target).closest('.category-table').find('.category-table-save-button').addClass('remove-display');
        $(target).closest('.category-table').find('.category-table-edit-button').removeClass('remove-display');
        $(target).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('border');
        $(target).closest('.category-table').find('.category-table-category-name .category-temp').removeAttr('contenteditable');
        $(target).closest('.category-table').find('.category-buttons-row').addClass('remove-display');
        $(target).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('category-temp').addClass('category');
        return;
    }

    function _deleteConfirmation(target, categoryId){
        $('.delete-warning-popup').removeClass('remove-display');
        $('.delete-warning-popup').on('click', '.delete-warning-popup-cancel', function(event){
            event.stopImmediatePropagation();
            _handleCancelDelete(target);
        });
        $('.delete-warning-popup').on('click', '.delete-warning-popup-confirm', function(event){
            event.stopImmediatePropagation();
            _handleConfirmDelete(target, categoryId);
        });
    }

    function AddText(len) {
        if(len === 0){
            $('.delete-warning-popup-text').text(`No items present - Do you still want to delete?`);
        }else{
            $('.delete-warning-popup-text').text(`"${len}" Uncompleted Items Present-Do you Still Want to Delete?`);
        }
        return;
    }

    function _deleteCategories(){
        $('.categories-list').on('click', '.category-table-delete-button', function () {
            let categorytext= $(this).closest('.category-table').find('.category-table-category-name a').text();
            let categoryId = $(this).closest('.category-table').find(`.category-${categorytext}`).attr('data-id');
            _deleteConfirmation(this, categoryId);
            _ajaxGetContents(categoryId);
        });
    }

    function _ajaxDeleteCategory(id){
        $.ajax('/categories',{
            method: 'DELETE',
            data: JSON.stringify({_id:id}),
            success: function () {
                _ajaxDeleteContent(id);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    function _ajaxDeleteContent(id){
        $.ajax('contents/removeall',{
            method: 'DELETE',
            data: JSON.stringify({contentid:id}),
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

    function _ajaxGetContents(id) {
        $.ajax('/contents', {
            method: 'GET',
            data: {
                categoryid: id,
                completed: false
            },
            success: function (obj) {
                AddText(obj.length);
                return;
            },
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return{
        deleteCategories:_deleteCategories,
    }
})();

let showFilters = (function(){
    function displayLatest(obj){
        let topFiveUpdates = obj.topFiveUpdates;
        let topRecentCreated = obj.topRecentCreated;

        const elementUpdate = topFiveUpdates.map(elem=>{
            if(elem.content.length >15){
                elem.content = elem.content.substring(0,15) + '..';
            }
            return `<p class="latest-updated-Categories-content">${elem.content} - "${elem.categoryname}"</p>`
        });

        const elementCreated = topRecentCreated.map(elem=>{
            if(elem.content.length >15){
                elem.content = elem.content.substring(0,15) + '..';
            }
            return `<p class="latest-created-Categories-content">${elem.content} - "${elem.categoryname}"</p>`
        });
        $('.latest-created-Categories').find('p').remove();
        $('.latest-updated-Categories').find('p').remove();
        $('.menu-latest-created-Categories').append(elementCreated);
        $('.latest-created-Categories').append(elementCreated);
        $('.latest-updated-Categories').append(elementUpdate);
        $('.menu-latest-updated-Categories').append(elementUpdate);
    }

    function _displayFilters() {
        $('.contents').on('click','.sync-Latest-link', function () {
            $('.latest-created-Categories').find('p').remove();
            $('.latest-updated-Categories').find('p').remove();
            _ajaxFilters();
        });
    }

    function _ajaxFilters() {
        $.ajax('/contents/filters', {
            method:'GET',
            success : function(obj){
                displayLatest(obj);
            },
            error: function (err) {
                console.log(err);
                throw err;
            }
        });
    }

    return{
        ajaxFilters : _ajaxFilters,
        displayFilters : _displayFilters,
    }
})();

let handleLatestFilterMenu = (function(){

    function _latestFilterCreated(){
        $('.menu-toggle-latest5-link-created').click(function(){
            $('.menu-latest-updated-Categories').addClass('remove-display');
            $('.menu-latest-updated-Categories').removeClass('menu-toggle-latest5-selected');
            $('.menu-latest-created-Categories').removeClass('remove-display');
            $(this).addClass('menu-toggle-latest5-selected');
            $('.menu-toggle-latest5-link-updated').removeClass('menu-toggle-latest5-selected');
        });
    }

    function _latestFilterUpdated() {
        $('.menu-toggle-latest5-link-updated').click(function () {
            $('.menu-latest-created-Categories').addClass('remove-display');
            $('.menu-latest-created-Categories').removeClass('menu-toggle-latest5-selected');
            $('.menu-latest-updated-Categories').removeClass('remove-display');
            $(this).addClass('menu-toggle-latest5-selected');
            $('.menu-toggle-latest5-link-created').removeClass('menu-toggle-latest5-selected');
        });
    }
    return{
        latestFilterUpdated :_latestFilterUpdated,
        latestFilterCreated :_latestFilterCreated
    }

})();

function handleMeatBallClick() {
    $('.contents-list').on('click', '.content-table-meatball', function(){
        if($(this).closest('.content-table').find('.content-table-text-div').attr('contenteditable')){
            $(this).closest('.content-table').find('.content-table-text-div').removeAttr('contenteditable');
            $(this).closest('.content-table').find('.content-table-text-div').removeClass('border');
        }
        if($(this).closest('.content-table').find('.content-table-edit-button').hasClass('remove-display')){
            $(this).closest('.content-table').find('.content-table-edit-button').removeClass('remove-display');
            $(this).closest('.content-table').find('.content-table-save-button').addClass('remove-display');
        }
        if($(this).closest('.content-table').find('.content-buttons-row').hasClass('remove-display')){
            $(this).closest('.content-table').find('.content-buttons-row').removeClass('remove-display')
        }else{
            $(this).closest('.content-table').find('.content-buttons-row').addClass('remove-display');
        }
    });
    return;
}

function handleRotatedMeatBallClick() {
    $('.categories-list').on('click', '.category-table-category-meatball', function () {
        let textVal=$(this).closest('.category-table').find('.category-table-category-name a').text();
        if($(this).closest('.category-table').find(`.category-${textVal}`).attr('contenteditable')){
            $(this).closest('.category-table').find(`.category-${textVal}`).removeAttr('contenteditable');
            $(this).closest('.category-table').find(`.category-${textVal}`).removeClass('border');
        }
        if($(this).closest('.category-table').find('.category-table-edit-button').hasClass('remove-display')){
            $(this).closest('.category-table').find('.category-table-edit-button').removeClass('remove-display');
            $(this).closest('.category-table').find('.category-table-save-button').addClass('remove-display');
        }
        if($(this).closest('.category-table').find('.category-buttons-row').hasClass('remove-display')){
            $(this).closest('.category-table').find('.category-buttons-row').removeClass('remove-display');
            $(this).closest('.category-table').find('.category-table-category-name .category').removeClass('category').addClass('category-temp');
        }else{
            $(this).closest('.category-table').find('.category-table-category-name .category-temp').removeClass('category-temp').addClass('category');
            $(this).closest('.category-table').find('.category-buttons-row').addClass('remove-display');
        }
    });
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
    $('.contents').on('click', '.add-content-div .add-content-link', function() {
        $('.contents').find('.add-content-form').removeClass('remove-display');
        $('.contents').find('.add-content-form').find('textArea').focus();
    });
}

function handleCancelForm(){
    $('.add-content-form').on('click', '.add-content-form-cancel', function(){
       $(this).closest('.add-content-form').find('textArea').val('');
       $(this).closest('.add-content-form').addClass('remove-display');
    });
}

function handleCloseCompletedPopUp(){
  $('.completed-latest-contents-close').click(function(){
      $('.completed-latest-contents').addClass('remove-display');
      $('.outer-Overlay').addClass('remove-display');
  });
}

function handleBurgerMenuClick() {
    $('.top-bar-burger-icon').click(function () {
        $('.menu-latest-updated-Categories').find('.latest-updated-Categories-content').remove();
        $('.menu-latest-created-Categories').find('.latest-created-Categories-content').remove();
        showFilters.ajaxFilters();
        $('.menu-toggle-latest5').removeClass('remove-display');
        $('.menu-toggle-latest5-content').removeClass('remove-display');
        $(this).addClass('sure-remove-display');
        $('.top-bar-cancel-icon').removeClass('remove-display');
        $('.left-menu-overlay').removeClass('remove-display');
        $('.menu-toggle').addClass('category-menu');
        $('.menu-toggle').addClass('sure-display');
        $('.category-menu').addClass('transform-left');
        $('.menu-toggle-latest5-link-updated').addClass('menu-toggle-latest5-selected');
    });

}

function handleCancelMenuClick() {
    $('.top-bar-cancel-icon').click(function () {
        $('.menu-toggle').removeClass('transform-left');
        $('.menu-toggle').removeClass('sure-display');
        $('.menu-toggle-latest5').addClass('remove-display');
        $('.menu-toggle-latest5-content').addClass('remove-display');
        $(this).addClass('remove-display');
        $('.menu-toggle').removeClass('category-menu');
        $('.top-bar-burger-icon').removeClass('sure-remove-display');
        $('.category-menu').removeClass('transform-left');
        $('.left-menu-overlay').addClass('remove-display');
    });

}


function main() {
    showFilters.displayFilters();
    serverCallContents.getContents();
    serverCallCategory.ajaxGetCategories();
    handleCompletedContents.removeCompletedContents();
    handleShowCompletedContents.showCompletedContents();
    handleAddContents.addContents();
    handleEditContents.editContents();
    addCategories.displayAddCategory();
    addCategories.addCategory();
    handleMeatBallClick();
    handleRotatedMeatBallClick();
    handleTick();
    handleShowForm();
    handleCancelForm();
    handleDeleteCategories.deleteCategories();
    handleEditCategories.handleCancel();
    handleEditCategories.editCategory();
    handleEditContents.handleCancel();
    handleDeleteContents.deleteContent();
    handleCloseCompletedPopUp();
    handleBurgerMenuClick();
    handleCancelMenuClick();
    handleLatestFilterMenu.latestFilterCreated();
    handleLatestFilterMenu.latestFilterUpdated();
    return;
}

$(main());
