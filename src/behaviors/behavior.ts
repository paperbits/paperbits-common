export interface BehaviorHandle {
    detach?: () => void;      // Keep detach, make it optional if dispose is primary
    update?: (config: any) => void; // Add update with a generic config type
}

export interface Behavior<TConfig> {
    init?(config?: TConfig): void;
    update?(config?: TConfig): void;
    dispose?(): void;
}


// class Behavior {
//     constructor(element, params, context) {
//       this.element = element;
//       this.params = params;
//       this.context = context;
//     }
  
//     init() {
//       // Initial setup logic
//     }
  
//     update(newParams) {
//       // Update logic when parameters change
//     }
  
//     dispose() {
//       // Cleanup logic
//     }
//   }





// // Generic Vue registration
// function registerVueBehavior(behaviorName, BehaviorClass) {
//     Vue.directive(behaviorName, {
//       bind: (element, binding, vnode) => {
//         const behavior = new BehaviorClass(element, binding.value, vnode.context);
//         element._behaviorInstance = behavior;
//         behavior.init();
//       },
//       update: (element, binding) => {
//         element._behaviorInstance.update(binding.value);
//       },
//       unbind: (element) => {
//         element._behaviorInstance.dispose();
//       }
//     });
//   }
  
//   // Usage:
//   registerVueBehavior('example-behavior', ExampleBehavior);
  