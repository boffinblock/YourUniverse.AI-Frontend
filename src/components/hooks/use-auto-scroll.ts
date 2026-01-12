// // hooks/useAutoScroll.ts
// import { useEffect, useRef, useState } from 'react';

// export const useAutoScroll = (dependencies: any[] = []) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
//     const lastDependencyRef = useRef(dependencies);

//     useEffect(() => {
//         const scrollContainer = containerRef.current;
//         if (!scrollContainer || !isAutoScrollEnabled) return;

//         // Check if dependencies changed (new messages added)
//         const hasNewContent = dependencies.some(
//             (dep, index) => dep !== lastDependencyRef.current[index]
//         );

//         if (hasNewContent) {
//             setTimeout(() => {
//                 scrollContainer.scrollTo({
//                     top: scrollContainer.scrollHeight,
//                     behavior: 'smooth'
//                 });
//             }, 100);
//         }

//         lastDependencyRef.current = dependencies;
//     }, dependencies);

//     useEffect(() => {
//         const scrollContainer = containerRef.current;
//         if (!scrollContainer) return;

//         const handleScroll = () => {
//             const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
//             const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
//             setIsAutoScrollEnabled(isAtBottom);
//         };

//         scrollContainer.addEventListener('scroll', handleScroll);
//         return () => scrollContainer.removeEventListener('scroll', handleScroll);
//     }, []);

//     const scrollToBottom = () => {
//         const scrollContainer = containerRef.current;
//         if (scrollContainer) {
//             scrollContainer.scrollTo({
//                 top: scrollContainer.scrollHeight,
//                 behavior: 'smooth'
//             });
//             setIsAutoScrollEnabled(true);
//         }
//     };

//     return { containerRef, isAutoScrollEnabled, scrollToBottom };
// };