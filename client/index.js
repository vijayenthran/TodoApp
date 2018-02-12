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

    function appendElementsUtil(element) {
        const formElement = `<form class="add-content-form" action="/">
           <fieldset class="add-content-form-fieldset">
               <legend class="add-content-form-legend">+ Add</legend>
               <input type="text" placeholder="e.g. Remind me About something" class="add-content-form-text" />
               <input type="submit" class="add-content-form-submit" />
           </fieldset>
        </form>`;
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
            return `<li class="content" data-contentid="${content._id}">${content.content}</li>`;
        });
        appendElementsUtil(element);
        $('.contents-list').append(element);
        return;
    }

    function _getContents() {
        $('.categories').on('click', '.category', function () {
            clearButtons();
            clearForm();
            let categoryVal = $(this).data('category');
            let id = $(this).data('id');
            _ajaxGetContents(categoryVal ,id);
        });
        return;
    }

    function _ajaxGetContents(categoryVal ,id) {
        $.ajax('/contents', {
            method: 'GET',
            data: {
                categoryid : id,
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
        $('.contents').on('click', '.content', function (event) {
            let contentVal = $(this).text();
            let id = $(this).attr('data-contentid');
            $(this).remove();
            const updatedObj = {
                _id: id,
                content: contentVal,
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
            event.preventDefault();
            let contentValue = $('.add-content-form-text').val();
            let id = $('.contents').attr('data-categoryid');
            _ajaxAddContents(contentValue, id);

        });
    }

    function appendElements(obj, contentValue) {
        const element = `<li class="content" data-contentid="${obj._id}">${contentValue}</li>`;
        $(element).insertBefore($('.contents').find('.add-content-form'));
        return;
    }

    function _ajaxAddContents(contentValue, id) {
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
                appendElements(obj,contentValue);
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
        $('.add-category-link').click(function (event) {
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
        const element =`<a class="category category-${obj.name}" data-category="${obj.name}" data-id="${obj._id}">${obj.name}</a>`;
        $('.categories').find('.categories-list').append(element);
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
                throw err;
            }
        })
    }

    return {
        displayAddCategory: _displayAddCategory,
        addCategory: _addCategory
    }

})();


function main() {
    serverCallCategory.ajaxGetCategories();
    serverCallContents.getContents();
    // handleCompletedContents.removeCompletedContents();
    handleShowCompletedContents.showCompletedContents();
    handleAddContents.addContents();
    addCategories.displayAddCategory();
    addCategories.addCategory();
    return;
}

$(main());
