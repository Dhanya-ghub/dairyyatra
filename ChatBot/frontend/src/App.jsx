import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Mic,
  MicOff,
  Send,
  ChevronDown,
  Sparkles,
  User,
} from "lucide-react";

import "./app.css";

const languages = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिंदी" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

const quickQuestions = {
  en: [
    "What is Dairy Yatra?",
    "Who can apply?",
    "How does it work?",
    "What will I learn?",
    "Tell me about the journey",
  ],

  ta: [
    "Dairy Yatra என்றால் என்ன?",
    "யார் விண்ணப்பிக்கலாம்?",
    "இது எப்படி செயல்படுகிறது?",
    "நான் என்ன கற்றுக்கொள்வேன்?",
  ],

  hi: [
    "Dairy Yatra क्या है?",
    "कौन आवेदन कर सकता है?",
    "यह कैसे काम करता है?",
    "मैं क्या सीखूंगा?",
  ],

  te: [
    "Dairy Yatra అంటే ఏమిటి?",
    "ఎవరు దరఖాస్తు చేసుకోవచ్చు?",
    "ఇది ఎలా పనిచేస్తుంది?",
    "నేను ఏమి నేర్చుకుంటాను?",
  ],

  mr: [
    "Dairy Yatra म्हणजे काय?",
    "कोण अर्ज करू शकतो?",
    "हे कसे कार्य करते?",
    "मी काय शिकेन?",
  ],

  kn: [
    "Dairy Yatra ಎಂದರೇನು?",
    "ಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?",
    "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?",
    "ನಾನು ಏನು ಕಲಿಯುತ್ತೇನೆ?",
  ],
};

const welcomeMessages = {
  en: "Hello! 👋 I'm the Dairy Yatra Assistant. How can I help you today?",
  ta: "வணக்கம்! 👋 நான் Dairy Yatra Assistant. இன்று உங்களுக்கு எப்படி உதவலாம்?",
  hi: "नमस्ते! 👋 मैं Dairy Yatra Assistant हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
  te: "హలో! 👋 నేను Dairy Yatra Assistant. ఈరోజు మీకు ఎలా సహాయం చేయగలను?",
  mr: "नमस्कार! 👋 मी Dairy Yatra Assistant आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
  kn: "ನಮಸ್ಕಾರ! 👋 ನಾನು Dairy Yatra Assistant. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
};

function getDemoAnswer(text, language) {
  const q = text.toLowerCase();

  if (
    q.includes("what is dairy") ||
    q.includes("dairy yatra") ||
    q.includes("dairy yatra என்றால்") ||
    q.includes("dairy yatra क्या")
  ) {
    const answers = {
      en: "Dairy Yatra is a learning and exposure journey focused on the dairy sector, rural entrepreneurship, farmers, businesses and real-world industry experiences.",
      ta: "Dairy Yatra என்பது பால் மற்றும் பால் சார்ந்த துறை, கிராமப்புற தொழில்முனைவு, விவசாயிகள் மற்றும் தொழில் அனுபவங்களை அறிமுகப்படுத்தும் ஒரு கற்றல் பயணம்.",
      hi: "Dairy Yatra डेयरी क्षेत्र, ग्रामीण उद्यमिता, किसानों, व्यवसायों और वास्तविक उद्योग अनुभवों पर केंद्रित एक सीखने और अनुभव यात्रा है।",
      te: "Dairy Yatra అనేది డెయిరీ రంగం, గ్రామీణ వ్యాపారవేత్తలు, రైతులు మరియు వాస్తవ పరిశ్రమ అనుభవాలపై దృష్టి పెట్టే అభ్యాస ప్రయాణం.",
      mr: "Dairy Yatra ही दुग्ध क्षेत्र, ग्रामीण उद्योजकता, शेतकरी, व्यवसाय आणि प्रत्यक्ष उद्योग अनुभवांवर आधारित शिकण्याची आणि अनुभवाची यात्रा आहे.",
      kn: "Dairy Yatra ಡೈರಿ ಕ್ಷೇತ್ರ, ಗ್ರಾಮೀಣ ಉದ್ಯಮಶೀಲತೆ, ರೈತರು, ವ್ಯವಹಾರಗಳು ಮತ್ತು ನೈಜ ಉದ್ಯಮ ಅನುಭವಗಳ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸಿದ ಕಲಿಕೆಯ ಪ್ರಯಾಣವಾಗಿದೆ.",
    };

    return answers[language];
  }

  if (
    q.includes("who can") ||
    q.includes("apply") ||
    q.includes("யார்") ||
    q.includes("कौन") ||
    q.includes("ఎవరు") ||
    q.includes("कोण") ||
    q.includes("ಯಾರು")
  ) {
    return {
      en: "Anyone who meets the programme's eligibility requirements can apply. The application form will guide you through the required details.",
      ta: "திட்டத்தின் தகுதி விதிமுறைகளை பூர்த்தி செய்பவர்கள் விண்ணப்பிக்கலாம். விண்ணப்பப் படிவம் தேவையான விவரங்களை வழிகாட்டும்.",
      hi: "कार्यक्रम की पात्रता आवश्यकताओं को पूरा करने वाले लोग आवेदन कर सकते हैं। आवेदन फॉर्म आपको आवश्यक जानकारी भरने में मार्गदर्शन करेगा।",
      te: "కార్యక్రమ అర్హతలను పూర్తి చేసే వారు దరఖాస్తు చేసుకోవచ్చు. అప్లికేషన్ ఫారం అవసరమైన వివరాలను సూచిస్తుంది.",
      mr: "कार्यक्रमाच्या पात्रता अटी पूर्ण करणारे सहभागी अर्ज करू शकतात. अर्ज फॉर्म आवश्यक माहिती भरण्यास मार्गदर्शन करेल.",
      kn: "ಕಾರ್ಯಕ್ರಮದ ಅರ್ಹತಾ ಅವಶ್ಯಕತೆಗಳನ್ನು ಪೂರೈಸುವವರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು. ಅರ್ಜಿ ನಮೂನೆಯು ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ನೀಡುತ್ತದೆ.",
    }[language];
  }

  if (
    q.includes("learn") ||
    q.includes("what will") ||
    q.includes("கற்றுக்கொ") ||
    q.includes("सीख") ||
    q.includes("నేర్చ") ||
    q.includes("शिक") ||
    q.includes("ಕಲಿಯ")
  ) {
    return {
      en: "Participants can gain exposure to dairy farming, entrepreneurship, industry practices, rural businesses and real-world opportunities across the dairy ecosystem.",
      ta: "பங்கேற்பாளர்கள் பால் பண்ணை, தொழில்முனைவு, தொழில் நடைமுறைகள், கிராமப்புற வணிகங்கள் மற்றும் பால் துறையின் பல்வேறு வாய்ப்புகளை அறிந்து கொள்ளலாம்.",
      hi: "प्रतिभागियों को डेयरी फार्मिंग, उद्यमिता, उद्योग प्रथाओं, ग्रामीण व्यवसायों और डेयरी क्षेत्र में वास्तविक अवसरों का अनुभव मिलेगा।",
      te: "పాల ఉత్పత్తి, వ్యాపారవేత్తలు, పరిశ్రమ పద్ధతులు, గ్రామీణ వ్యాపారాలు మరియు డెయిరీ రంగంలోని అవకాశాలపై అనుభవం పొందవచ్చు.",
      mr: "सहभागींना दुग्ध व्यवसाय, उद्योजकता, उद्योग पद्धती, ग्रामीण व्यवसाय आणि दुग्ध क्षेत्रातील प्रत्यक्ष संधींचा अनुभव मिळू शकतो.",
      kn: "ಭಾಗವಹಿಸುವವರು ಡೈರಿ ಕೃಷಿ, ಉದ್ಯಮಶೀಲತೆ, ಉದ್ಯಮದ ವಿಧಾನಗಳು, ಗ್ರಾಮೀಣ ವ್ಯವಹಾರಗಳು ಮತ್ತು ಡೈರಿ ಕ್ಷೇತ್ರದ ನೈಜ ಅವಕಾಶಗಳ ಬಗ್ಗೆ ಅನುಭವ ಪಡೆಯಬಹುದು.",
    }[language];
  }

  return {
    en: "I'd be happy to help! You can ask me about Dairy Yatra, eligibility, the journey, learning opportunities, applications and other programme-related questions.",
    ta: "நான் உதவ தயாராக இருக்கிறேன்! Dairy Yatra, தகுதி, பயணம், கற்றல் வாய்ப்புகள் மற்றும் விண்ணப்பம் குறித்து கேட்கலாம்.",
    hi: "मैं आपकी मदद करने के लिए तैयार हूँ! आप Dairy Yatra, पात्रता, यात्रा, सीखने के अवसर और आवेदन के बारे में पूछ सकते हैं।",
    te: "నేను సహాయం చేయడానికి సిద్ధంగా ఉన్నాను! Dairy Yatra, అర్హత, ప్రయాణం, అభ్యాస అవకాశాలు మరియు దరఖాస్తు గురించి అడగవచ్చు.",
    mr: "मी मदत करण्यासाठी तयार आहे! Dairy Yatra, पात्रता, प्रवास, शिकण्याच्या संधी आणि अर्जाबद्दल तुम्ही विचारू शकता.",
    kn: "ನಾನು ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧನಿದ್ದೇನೆ! Dairy Yatra, ಅರ್ಹತೆ, ಪ್ರಯಾಣ, ಕಲಿಕೆಯ ಅವಕಾಶಗಳು ಮತ್ತು ಅರ್ಜಿಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
  }[language];
}

function App() {
  const [language, setLanguage] = useState("en");
  const [languageOpen, setLanguageOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: welcomeMessages.en,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const changeLanguage = (code) => {
    setLanguage(code);
    setLanguageOpen(false);

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: welcomeMessages[code],
      },
    ]);
  };

  const sendMessage = (messageText = input) => {
    const text = messageText.trim();

    if (!text || typing) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const answer = getDemoAnswer(text, language);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: answer,
        },
      ]);

      setTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;

    const speechLanguages = {
      en: "en-IN",
      ta: "ta-IN",
      hi: "hi-IN",
      te: "te-IN",
      mr: "mr-IN",
      kn: "kn-IN",
    };

    recognition.lang = speechLanguages[language];

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  return (
    <div className="dy-app">
      <div className="dy-shell">

        {/* HEADER */}
        <header className="dy-header">

          <div className="dy-brand">
            <div className="dy-brand-icon">
              <img src="/botlg.png" alt="Dairy Yatra Assistant" />
             
            </div>
            <div className="dy-brand-text">
              <h1>Dairy Yatra Assistant</h1>
              <p>Your guide to the Dairy Yatra</p>
            
            </div>
          </div>

          <div className="dy-header-right">
            
              <div className="dy-online-status">
                <span className="dy-online-dot"></span>
                <span>Online</span>
              </div>
          </div>

          {/* LANGUAGE */}
          <div className="dy-language-container">

            <button
              className="dy-language-trigger"
              onClick={() =>
                setLanguageOpen((prev) => !prev)
              }
            >
              <span>
                {
                  languages.find(
                    (item) => item.code === language
                  )?.label
                }
              </span>

              <ChevronDown
                size={14}
                className={
                  languageOpen ? "rotate" : ""
                }
              />
            </button>

            {languageOpen && (
              <div className="dy-language-menu">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    className={
                      language === item.code
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      changeLanguage(item.code)
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* CHAT */}
        <main className="dy-card">

          <div className="dy-messages" ref={messagesRef}>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`dy-row ${message.sender}`}
              >

                <div
                  className={`dy-avatar ${message.sender}`}
                >
                  {message.sender === "bot" ? (
                    <img src="/botlg.png" alt="Dairy Yatra Assistant" />
                  ) : (
                    <User size={15} />
                  )}
                </div>

                <div className="dy-bubble">
                  {message.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="dy-welcome-helper">
                <div className="dy-helper-title">
                  <Sparkles size={14} />
                  Popular questions
                </div>

                <div className="dy-quick-grid">
                  {quickQuestions[language].map(
                    (question) => (
                      <button
                        key={question}
                        onClick={() =>
                          sendMessage(question)
                        }
                      >
                        {question}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {typing && (
              <div className="dy-row bot">

                <div className="dy-avatar bot">
                  <img src="/botlg.png" alt="Dairy Yatra Assistant"/>
                </div>

                <div className="dy-bubble dy-typing">
                  <span className="dy-dot"></span>
                  <span className="dy-dot"></span>
                  <span className="dy-dot"></span>
                </div>

              </div>
            )}

          </div>

          {/* INPUT */}
          <div className="dy-input-bar">

            <div className="dy-input-wrap">

              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
              />

              {/* MICROPHONE */}
              <button
                className={`dy-mic ${
                  listening ? "active" : ""
                }`}
                onClick={startVoiceInput}
                title={
                  listening
                    ? "Stop listening"
                    : "Voice input"
                }
              >
                {listening ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>

              {/* SEND */}
              <button
                className="dy-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                title="Send message"
              >
                <Send size={17} />
              </button>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default App;