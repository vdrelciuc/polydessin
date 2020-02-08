// import { Coords } from './coordinates';
// import { Renderer2 } from '@angular/core';
// import { TestBed } from '@angular/core/testing';

// describe('Coords', () => {

//   let point: Coords;
//   const testValue = 100;

//   beforeEach( () => { 
//     TestBed.configureTestingModule({
//       declarations: [  ],
//       providers: [
//         {
//           provide: Renderer2,
//           useValue: {
//             createElement: () => null,
//             setAttribute: () => null,
//             appendChild: () => null,
//             listen: () => null,
//             nativeElement: {
//               useValue: {
//                 getBoundingClientRect: () => 100,
//               }
//             }
//           },
//         },
//       ],
//     }).compileComponents();
//     point = new Coords(10, 10); 
//   });

//   it('should create a Coords', () => {
//     expect(new Coords(10, 10)).toBeTruthy();
//   });

//   it('#getCoords should get mouse coords', () => {
//     const pointer = Coords.getCoords(new MouseEvent('mouseup', {
//       clientX: testValue,
//       clientY: testValue
//     }));
//     expect(pointer.x).toEqual(testValue);
//     expect(pointer.y).toEqual(testValue);
//   });

//   it('#getEffectiveCoords should return effective coordinates', () => {
//     const pointer = Coords.getEffectiveCoords(
//       TestBed.get(Renderer2), new MouseEvent('mouseup', {
//         clientX: testValue * 2,
//         clientY: testValue * 2
//       })
//     );
//     expect(pointer.x).toEqual(testValue);
//     expect(pointer.y).toEqual(testValue);
//   });

//   it('should be able to access coordinates', () => {
//     expect(point.x).toBe(10);
//     expect(point.y).toBe(10);
//   });

//   it('should be able to change coordinates', () => {
//     point.x = 1;
//     point.y = 3;
//     expect(point.x).toBe(1);
//     expect(point.y).toBe(3);
//   });

//   it('#getQuadrant should return correct quadrant from the giving origin coords', () => {
//     expect(point.getQuadrant(new Coords(5, 15))).toBe(1);
//     expect(point.getQuadrant(new Coords(15, 15))).toBe(2);
//     expect(point.getQuadrant(new Coords(15, 5))).toBe(3);
//     expect(point.getQuadrant(new Coords(5, 5))).toBe(4);
//   });
// });
