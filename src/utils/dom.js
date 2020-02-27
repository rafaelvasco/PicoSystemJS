export const Dom = {

    create: function(tagName, id) {
        const element = document.createElement(tagName);
        if(id) {
            element.setAttribute('id', id);
        }
        return element;
    }

}
