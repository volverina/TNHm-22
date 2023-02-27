var count = 1;

AFRAME.registerComponent('hello', {
	init: function () {
		console.log('Компонент запущено: ' + count);
		count++;
		console.log("integerProperty: "+this.attrValue.integerProperty);
		console.log("arrayProperty: ");
		console.log(this.attrValue.arrayProperty);
	},
	schema: {
		arrayProperty: {type: 'array', default: []},
		integerProperty: {type: 'int', default: 5}
	}
});
		

