
class Game {
    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D;
    private TILE_SIZE = 20;
    private TILES_X: number;
    private TILES_Y: number;
    private board: boolean[][];
    private cycles: number;

    constructor(private canvas: HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d')!;
        this.TILES_X = this.width / this.TILE_SIZE;
        this.TILES_Y = this.height / this.TILE_SIZE;
        this.prepareCanvas();
        this.board = this.resetBoard();
        // this.board[1][0] = true;
        // this.board[2][1] = true;
        // this.board[0][2] = true;
        // this.board[1][2] = true;
        // this.board[2][2] = true;
        this.board = this.prepareRandom();
        this.cycles = 0;
    }

    public step(): void {
        this.render();
        this.update();
    }

    public loop() {
        this.cycles++;
        this.step();
        const that = this;
        setTimeout(function() {
            that.loop()
        }, 500);
    }

    private update() {
        this.board = this.computeNextGeneration();
    }

    private render() {
        this.clear();
        this.drawBoard();
        this.drawBorders();
        document.getElementById('counter')!.innerHTML = this.cycles.toString();
    }

    private drawBoard(): void {
        for (let i = 0; i < this.TILES_X; i++) {
            for (let j = 0; j < this.TILES_Y; j++) {
                if (!this.isAlive(i, j)) {
                    continue;
                }
                this.ctx.fillRect(i * this.TILE_SIZE, j * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
            }
        }
    }

    private prepareRandom(): boolean[][] {
        const matrix = this.resetBoard();

        for (let i = 0; i < this.TILES_X; i++) {
            for (let j = 0; j < this.TILES_Y; j++) {
                matrix[i][j] = Math.random() < 0.3;
            }
        }
        return matrix;
    }

    private computeNextGeneration(): boolean[][] {
        const matrix: boolean[][] = this.resetBoard();

        for (let i = 0; i < this.TILES_X; i++) {
            for (let j = 0; j < this.TILES_Y; j++) {
                if (this.isAlive(i, j)) {
                    const count = this.neighboursCount(i, j);
                    if (count === 2 || count === 3) {
                        matrix[i][j] = true;
                    }
                } else {
                    if (this.neighboursCount(i, j) === 3) {
                        matrix[i][j] = true;
                    }
                }
            }
        }

        return matrix;
    }

    private resetBoard(): boolean[][] {
        const matrix:boolean[][] = [];

        for (let i = 0; i < this.TILES_X; i++) {
            const row: boolean[] = [];

            for (let j = 0; j < this.TILES_Y; j++) {
                row.push(false);
            }
            matrix.push(row);
        }

        return matrix;
    }

    private isAlive(x: number, y: number): number {
        if (x < 0 || x >= this.TILES_X || y < 0 || y >= this.TILES_Y) {
            return 0;
        }

        return this.board[x][y] ? 1 : 0;
    }

    private neighboursCount(x: number, y: number): number {
        let count = 0;
        for (let i of [-1, 0, 1]) {
            for (let j of [-1, 0, 1]) {
                if (! (i === 0 && j === 0)) {
                    count += this.isAlive(x + i, y + j);
                }
            }
        }

        return count;
    }

    private drawBorders() {
        for (let i = 0; i < this.TILES_X; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.TILE_SIZE - 0.5, 0);
            this.ctx.lineTo(i * this.TILE_SIZE - 0.5, this.height);
            this.ctx.stroke();
        }

        for (let i = 0; i < this.TILES_Y; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.TILE_SIZE - 0.5);
            this.ctx.lineTo(this.width, i * this.TILE_SIZE - 0.5);
            this.ctx.stroke();
        }
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    private prepareCanvas(): void {
        this.ctx.fillStyle = "rgb(100, 240, 150)";
        this.ctx.strokeStyle = "rgb(90, 90, 90)";
        this.ctx.lineWidth = 0.5; // retina
    }
}



class App {
    private game: Game;

    constructor(
        private canvas: HTMLCanvasElement
    ) {
    }

    run(): void {
        console.log('Hello World');
        this.game = new Game(this.canvas);
        this.game.loop();
    }
}


const app:App = new App(
    document.querySelector<HTMLCanvasElement>('#game')!
);

app.run();
