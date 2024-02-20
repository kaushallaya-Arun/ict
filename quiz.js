// Quiz module
const Quiz = {
  quizData: [],
  currentQuestion: 0,

  async loadQuizData() {
    try {
      const response = await fetch('quiz-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.length || !Array.isArray(data)) {
        throw new Error('Invalid quiz data format');
      }

      // Shuffle the array of questions
      this.quizData = data.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error loading quiz data:', error);
    }
  },

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  },

  async loadQuestion() {
    const currentQuizData = this.quizData[this.currentQuestion];

    if (!currentQuizData) {
      console.error('Quiz data is undefined or empty.');
      return;
    }

    $('#question-text').text(currentQuizData.question);

    const optionsContainer = $('#options-container');
    optionsContainer.empty();

    // Shuffle the options randomly
    const shuffledOptions = [...currentQuizData.options];
    this.shuffleArray(shuffledOptions);

    const buttons = shuffledOptions.map(option => {
      return $('<button>')
        .text(option)
        .addClass('option')
        .click(() => this.checkAnswer(option));
    });

    optionsContainer.append(buttons);
  },

  async checkAnswer(userAnswer) {
    const correctAnswer = this.quizData[this.currentQuestion].answer.trim().toLowerCase();

    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      this.showCorrectAnimation();

      await this.delay(1500);

      console.log("User Answer:", userAnswer);
      console.log("Correct Answer:", correctAnswer);

      this.currentQuestion++;
      if (this.currentQuestion < this.quizData.length) {
        this.hideCorrectAnimation();
        await this.loadQuestion();
      } else {
        this.hideCorrectAnimation();
        // Display a message on the page instead of using alert
        $('#message-container').text("ප්‍රශ්නපත්‍රය ඉවරයි").show();
      }
    } else {
      this.showIncorrectMessage();
    }
  },

  showCorrectAnimation() {
    const correctText = $('<div>')
      .addClass('correct-tick')
      .text('නිවැරදියි');

    $('body').append(correctText);
  },

  hideCorrectAnimation() {
    $('.correct-tick').remove();
  },

  showIncorrectMessage() {
    const incorrectMessage = $('<div>')
      .addClass('incorrect-message')
      .text('වැරදියි! නැවත උත්සහ කරන්න.');

    $('body').append(incorrectMessage);

    setTimeout(() => {
      this.hideIncorrectMessage();
    }, 1500);
  },

  hideIncorrectMessage() {
    $('.incorrect-message').remove();
  },

  async startQuiz() {
    $('#welcome-container').hide();
    $('#quiz-container').show();
    await this.loadQuestion();

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log(isMobile ? 'Mobile device detected' : 'Non-mobile device detected');
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Hide the footer after clicking the button
  hideFooter() {
    // Get the footer element by its ID
    var footer = document.getElementById('myFooter');

    // Add the 'hidden' class to the footer
    footer.classList.add('hidden');
  }
};

// Document ready
$(document).ready(async function () {
  // Check if JavaScript is enabled
  $('#js-disabled-message').hide();

  await Quiz.loadQuizData();
  $('#startQuizButton').click(function (event) {
    event.preventDefault();
    Quiz.startQuiz();
  });

  // Call the hideFooter function
  Quiz.hideFooter();
});
