/**
 * Decorator for creating custom elements
 *
 * @param elementName - The name of the new element.
 */ /*
export function customComponent(elementName: string) {
 return function(target: CustomElementConstructor) {
   const originalMethod = target.prototype.connectedCallback;

   // function() rather than () => is important because of the scoping of 'this'
   target.prototype.connectedCallback = function() {
     originalMethod.apply(this);
   };
   customElements.define(elementName, target);
 };
}
*/
