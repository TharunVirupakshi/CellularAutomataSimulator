

const workercode = () => {

    const countNgbhrs = (grid, gridSize, nbors, r0, c0, n) => {
        // nbors.fill(0)
        for (let r1 = -1; r1 <= 1; ++r1) {
            for (let c1 = -1; c1 <= 1; ++c1) {
                if (r1 != 0 || c1 != 0) {
                    const r = r0 + r1;
                    const c = c0 + c1;

                    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
                        nbors[grid[r][c]]++
                        // console.log('nbrs counted for ',r0,' ',c0, ' is ', nbors);
                    }
                }
            }
        }
        // To account for dead cells outside the grid border
        let sum = nbors.reduce((accumulator, cuurentVal) => accumulator + cuurentVal, 0);
        while (sum < n) {
            nbors[0]++
            sum = nbors.reduce((accumulator, cuurentVal) => accumulator + cuurentVal, 0);
        }
    }
    //Compute Next Boards LOGIC
    const computeNextGen = (states, grid, gridSize, ngbrhood_size, rules) => {
        // const DEAD = 0;
        // const ALIVE = 1;
        const nbors = new Array(states).fill(0);

        // console.log('Computing next gen [worker thread]......');
        // console.log('nbors[]: ', nbors);

        const nextGrid = grid.map((rowArray, row) =>
            rowArray.map((cell, col) => {
                nbors.fill(0); //init
                countNgbhrs(grid, gridSize, nbors, row, col, ngbrhood_size);
                // console.log('nbrs counted for ', row, ' ', col, ' is ', nbors);
                const trans = rules[cell]
                let newCell = trans[nbors.join("")];

                if (newCell === undefined)
                    newCell = trans["default"]

                return newCell

            })
        );

        // console.log('NEXT GEN: ', nextGrid);

        return nextGrid;


    }

    let intervalId;
    var gridCopy;
    const startInterval = (payload) => {
        const {states, gridSize, ngbrhood_size, rules, delay} = payload;

        

        intervalId = setInterval(() => {
            const result = computeNextGen(states, gridCopy, gridSize, ngbrhood_size, rules)
            gridCopy = result
            self.postMessage({action: 'PLAYING',res: result});
        }, delay ?? 500);
    };

    const stopInterval = () => {
        clearInterval(intervalId);
        console.log('[THREAD] Stopped....')
        self.postMessage({action: 'STOPPED',res: NULL})
    };

    self.onmessage = function (e) {

        // console.log("[THREAD] Msg received: ", e.data);
        const {action, payload} = e.data;

        
        
        switch(action){
            case "COMPUTE_NEXT_GEN": 
                const {states, grid, gridSize, ngbrhood_size, rules, delay} = payload;
                const result = computeNextGen(states, grid, gridSize, ngbrhood_size, rules)
                self.postMessage({action: 'COMPUTED',res: result})
                break;
            case "START":
                console.log('[THREAD] Playing....')
                gridCopy = payload?.grid
                startInterval(payload);
                break;
            case "STOP":
               
                stopInterval();
                break;
            default:
                break;
        }
        
    };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

export default worker_script
