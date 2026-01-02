Axis coordinate map:
        X: 0 to 100 (Left to Right)
        Y: 100 to 0 (Bottom to Top)
        Middle: (50, 50)
        Left: (0, 50)
        Right: (100, 50)
        Top: (50, 0)
        Bottom: (50, 100)

##Todo:
1. fix first click no audio bug.
        1. brainstorm:  web audio api + react life cycle + async/await, 
                        narrow down to make click work first time, then work up.
        no bug no more... weird

2. fix responsive layout.
3. figure out wording
4. write a short readme. 
5. deploy.


// UI             EFFECT        RANGE
//x 50 -> 100      LFO          Min:  Max:25hz?
// setrate-> getrate-> getfadercurve 25hz rate max.
Descriptive map of coordinates to effect ranges.
        research appropriate effect levels.
Replace fader math with getFaderCurve

     