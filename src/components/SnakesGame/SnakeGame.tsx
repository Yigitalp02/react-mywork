import React from 'react';
import './SnakeGame.css';
import GameOver from './GameOver';
import PausedModal from './PausedModal';

interface SnakePart {
  Xpos: number;
  Ypos: number;
}

interface Apple {
  Xpos: number;
  Ypos: number;
}

interface SnakeGameState {
  width: number;
  height: number;
  blockWidth: number;
  blockHeight: number;
  gameLoopTimeout: number;
  timeoutId: NodeJS.Timeout;
  startSnakeSize: number;
  snake: SnakePart[];
  apple: Apple;
  direction: 'left' | 'right' | 'up' | 'down';
  directionChanged: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  snakeColor: string;
  appleColor: string;
  score: number;
  highScore: number;
  newHighScore: boolean;
}

interface SnakeGameProps {
  percentageWidth?: number;
  startSnakeSize?: number;
  snakeColor?: string;
  appleColor?: string;
}

class SnakeGame extends React.Component<SnakeGameProps, SnakeGameState> {
  constructor(props: SnakeGameProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      width: 0,
      height: 0,
      blockWidth: 0,
      blockHeight: 0,
      gameLoopTimeout: 80,
      timeoutId: setTimeout(() => {}, 0),
      startSnakeSize: 0,
      snake: [],
      apple: { Xpos: 0, Ypos: 0 },
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      isPaused: false, // For pause functionality
      snakeColor: this.props.snakeColor || this.getRandomColor(),
      appleColor: this.props.appleColor || this.getRandomColor(),
      score: 0,
      highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
      newHighScore: false,
    };
  }

  componentDidMount() {
    this.initGame();
    window.addEventListener('keydown', this.handleKeyDown);
    this.gameLoop();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  initGame() {
    let percentageWidth = this.props.percentageWidth || 40;
    let width = Math.floor(
      document.getElementById('GameBoard')?.parentElement?.offsetWidth! *
        (percentageWidth / 100)
    );
    width -= width % 30;
    if (width < 30) width = 30;

    let height = (width / 3) * 2;
    let blockWidth = width / 30;
    let blockHeight = height / 20;

    let startSnakeSize = this.props.startSnakeSize || 6;
    let snake: SnakePart[] = [];
    let Xpos = width / 2;
    const Ypos = height / 2;

    snake.push({ Xpos, Ypos });
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth;
      snake.push({ Xpos, Ypos });
    }

    let appleXpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
    let appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
    while (appleYpos === snake[0].Ypos) {
      appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
    }

    this.setState({
      width,
      height,
      blockWidth,
      blockHeight,
      startSnakeSize,
      snake,
      apple: { Xpos: appleXpos, Ypos: appleYpos },
    });
  }

  gameLoop() {
    const timeoutId = setTimeout(() => {
      if (!this.state.isGameOver && !this.state.isPaused) {
        this.moveSnake();
        this.tryToEatSnake();
        this.tryToEatApple();
        this.setState({ directionChanged: false });
      }

      this.gameLoop();
    }, this.state.gameLoopTimeout);

    this.setState({ timeoutId });
  }

  resetGame() {
    this.initGame();
    this.setState({
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      gameLoopTimeout: 50,
      snakeColor: this.getRandomColor(),
      appleColor: this.getRandomColor(),
      score: 0,
      newHighScore: false,
    });
  }

  getRandomColor() {
    const hexa = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hexa[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  moveSnake() {
    const { snake } = this.state;
    let previousPartX = snake[0].Xpos;
    let previousPartY = snake[0].Ypos;
    let tmpPartX = previousPartX;
    let tmpPartY = previousPartY;

    this.moveHead();

    for (let i = 1; i < snake.length; i++) {
      tmpPartX = snake[i].Xpos;
      tmpPartY = snake[i].Ypos;
      snake[i].Xpos = previousPartX;
      snake[i].Ypos = previousPartY;
      previousPartX = tmpPartX;
      previousPartY = tmpPartY;
    }

    this.setState({ snake });
  }

  moveHead() {
    switch (this.state.direction) {
      case 'left':
        this.moveHeadLeft();
        break;
      case 'up':
        this.moveHeadUp();
        break;
      case 'right':
        this.moveHeadRight();
        break;
      default:
        this.moveHeadDown();
    }
  }

  moveHeadLeft() {
    const { width, blockWidth, snake } = this.state;
    snake[0].Xpos = snake[0].Xpos <= 0 ? width - blockWidth : snake[0].Xpos - blockWidth;
    this.setState({ snake });
  }

  moveHeadUp() {
    const { height, blockHeight, snake } = this.state;
    snake[0].Ypos = snake[0].Ypos <= 0 ? height - blockHeight : snake[0].Ypos - blockHeight;
    this.setState({ snake });
  }

  moveHeadRight() {
    const { width, blockWidth, snake } = this.state;
    snake[0].Xpos = snake[0].Xpos >= width - blockWidth ? 0 : snake[0].Xpos + blockWidth;
    this.setState({ snake });
  }

  moveHeadDown() {
    const { height, blockHeight, snake } = this.state;
    snake[0].Ypos = snake[0].Ypos >= height - blockHeight ? 0 : snake[0].Ypos + blockHeight;
    this.setState({ snake });
  }

  handleKeyDown(event: KeyboardEvent) {
    // Toggle pause when the Esc key is pressed
    if (event.key === 'Escape') {
      this.setState((prevState) => ({
        isPaused: !prevState.isPaused,
      }));
      return;
    }

    // if spacebar is pressed to run a new game
    if (this.state.isGameOver && event.keyCode === 32) {
      this.resetGame();
      return;
    }

    if (this.state.directionChanged || this.state.isPaused) return;

    switch (event.keyCode) {
      case 37:
      case 65:
        this.goLeft();
        break;
      case 38:
      case 87:
        this.goUp();
        break;
      case 39:
      case 68:
        this.goRight();
        break;
      case 40:
      case 83:
        this.goDown();
        break;
      default:
        break;
    }
    this.setState({ directionChanged: true });
  }

  goLeft() {
    if (this.state.direction !== 'right') {
      this.setState({ direction: 'left' });
    }
  }

  goUp() {
    if (this.state.direction !== 'down') {
      this.setState({ direction: 'up' });
    }
  }

  goRight() {
    if (this.state.direction !== 'left') {
      this.setState({ direction: 'right' });
    }
  }

  goDown() {
    if (this.state.direction !== 'up') {
      this.setState({ direction: 'down' });
    }
  }

  tryToEatApple() {
    const { snake, apple } = this.state;

    if (snake[0].Xpos === apple.Xpos && snake[0].Ypos === apple.Ypos) {
      const width = this.state.width;
      const height = this.state.height;
      const blockWidth = this.state.blockWidth;
      const blockHeight = this.state.blockHeight;
      const newTail = { Xpos: apple.Xpos, Ypos: apple.Ypos };
      let highScore = this.state.highScore;
      let newHighScore = this.state.newHighScore;
      let gameLoopTimeout = this.state.gameLoopTimeout;

      snake.push(newTail);

      apple.Xpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
      apple.Ypos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;

      while (this.isAppleOnSnake(apple.Xpos, apple.Ypos)) {
        apple.Xpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
        apple.Ypos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
      }

      if (this.state.score === highScore) {
        highScore++;
        localStorage.setItem('snakeHighScore', highScore.toString());
        newHighScore = true;
      }

      if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5;

      this.setState({
        snake,
        apple,
        score: this.state.score + 1,
        highScore,
        newHighScore,
        gameLoopTimeout,
      });
    }
  }

  isAppleOnSnake(appleXpos: number, appleYpos: number) {
    const snake = this.state.snake;
    for (let i = 0; i < snake.length; i++) {
      if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos) return true;
    }
    return false;
  }

  tryToEatSnake() {
    const { snake } = this.state;
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos) {
        this.setState({ isGameOver: true });
      }
    }
  }

  render() {
    if (this.state.isGameOver) {
      return (
        <GameOver
          width={this.state.width}
          height={this.state.height}
          highScore={this.state.highScore}
          newHighScore={this.state.newHighScore}
          score={this.state.score}
        />
      );
    }

    return (
      <div
        id="GameBoard"
        style={{
          width: this.state.width,
          height: this.state.height,
          borderWidth: this.state.width / 50,
        }}
      >
        {this.state.snake.map((snakePart, index) => (
          <div
            key={index}
            className="Block"
            style={{
              width: this.state.blockWidth,
              height: this.state.blockHeight,
              left: snakePart.Xpos,
              top: snakePart.Ypos,
              background: this.state.snakeColor,
            }}
          />
        ))}
        <div
          className="Block"
          style={{
            width: this.state.blockWidth,
            height: this.state.blockHeight,
            left: this.state.apple.Xpos,
            top: this.state.apple.Ypos,
            background: this.state.appleColor,
          }}
        />
        <div id="Score" style={{ fontSize: this.state.width / 20 }}>
          HIGH-SCORE: {this.state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE: {this.state.score}
          <button className="home-button" onClick={() => window.location.href = '/react-mywork'}>
            Go to Home
          </button>
        </div>

        {this.state.isPaused && (
          <PausedModal setIsPaused={() => this.setState({ isPaused: false })} />
        )}
      </div>
    );
  }
}

export default SnakeGame;