"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationDetector = void 0;
class AnimationDetector {
    name = 'AnimationDetector';
    async detect(context) {
        const deps = context.dependencies;
        let animation = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Framer Motion', dep: 'framer-motion' },
            { name: 'GSAP', dep: 'gsap' },
            { name: 'Anime.js', dep: 'animejs' },
            { name: 'Lottie', dep: 'lottie-web' },
            { name: 'Motion One', dep: 'motion' },
            { name: 'React Spring', dep: 'react-spring' },
            { name: 'React Transition Group', dep: 'react-transition-group' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                animation = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('animation', {
            id: 'animation',
            type: 'animation',
            name: animation,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.AnimationDetector = AnimationDetector;
//# sourceMappingURL=detector.js.map