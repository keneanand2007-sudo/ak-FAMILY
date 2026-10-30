import { useState } from 'react';
import { Bot, Send, Check, X, Sparkles } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useFinanceStore } from '../../finance/store';
import { useHealthStore } from '../../health/store';
import { useEducationStore } from '../../education/store';
import { useDocumentsStore } from '../../documents/store';
import { parseIntent } from '../utils/intentParser';
import { executeQuery } from '../utils/queryExecutor';
import { executeCommand } from '../utils/commandExecutor';

var SUGGESTIONS = [
  'What is our savings?',
  'Any upcoming exams?',
  'Any alerts?',
  'Any documents expiring?',
  'How many members?',
];

export default function AiPage() {
  var familyStore = useFamilyStore();
  var members = familyStore.members;
  var financeStore = useFinanceStore();
  var healthStore = useHealthStore();
  var educationStore = useEducationStore();
  var documentsStore = useDocumentsStore();

  var messagesState = useState([
    { role: 'ai', text: 'Hi, I am your Family AI. Ask me a question, or tell me to add something. Try one of the suggestions below.' },
  ]);
  var messages = messagesState[0];
  var setMessages = messagesState[1];

  var inputState = useState('');
  var input = inputState[0];
  var setInput = inputState[1];

  var pendingCommandState = useState(null);
  var pendingCommand = pendingCommandState[0];
  var setPendingCommand = pendingCommandState[1];

  function addMessage(role, text) {
    setMessages(function (prev) { return prev.concat([{ role: role, text: text }]); });
  }

  function handleSend(rawText) {
    var text = (rawText !== undefined ? rawText : input).trim();
    if (!text) return;

    addMessage('user', text);
    setInput('');

    var intent = parseIntent(text, { members: members });

    if (intent.type === 'query') {
      var financeData = { income: financeStore.income, expenses: financeStore.expenses, assets: financeStore.assets, liabilities: financeStore.liabilities, budget: financeStore.budget };
      var answer = executeQuery(intent.action, {
        members: members,
        financeData: financeData,
        healthData: healthStore.healthData,
        educationData: educationStore.educationData,
        documents: documentsStore.documents,
      });
      setTimeout(function () { addMessage('ai', answer); }, 200);
      return;
    }

    if (intent.type === 'command') {
      setPendingCommand(intent);
      setTimeout(function () { addMessage('ai', 'Please confirm: ' + intent.summary); }, 200);
      return;
    }

    setTimeout(function () {
      addMessage('ai', 'I did not understand that. Try asking about savings, exams, appointments, alerts, or expiring documents - or say something like "add expense 500 food".');
    }, 200);
  }

  function confirmCommand() {
    if (!pendingCommand) return;
    var result = executeCommand(pendingCommand.action, pendingCommand.payload, {
      financeStore: financeStore,
      healthStore: healthStore,
    });
    addMessage('ai', result);
    setPendingCommand(null);
  }

  function cancelCommand() {
    addMessage('ai', 'Okay, cancelled.');
    setPendingCommand(null);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSend();
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto flex flex-col" style={{ minHeight: '80vh' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <Bot size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Family AI</h1>
          <p className="text-sm text-slate-500">Ask about your family's data, or tell it to add something.</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-4 overflow-y-auto space-y-3" style={{ minHeight: '400px' }}>
        {messages.map(function (msg, i) {
          var isUser = msg.role === 'user';
          return (
            <div key={i} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
              <div className={
                isUser
                  ? 'max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-sm'
                  : 'max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-slate-100 text-slate-800 text-sm flex items-start gap-2'
              }>
                {!isUser && <Sparkles size={14} className="text-indigo-500 mt-0.5 shrink-0" />}
                <span>{msg.text}</span>
              </div>
            </div>
          );
        })}

        {pendingCommand && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-sm">
              <p className="text-amber-800 font-medium mb-2">{pendingCommand.summary}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={confirmCommand}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  <Check size={13} />
                  <span>Confirm</span>
                </button>
                <button
                  onClick={cancelCommand}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(function (s) {
          return (
            <button
              key={s}
              onClick={function () { handleSend(s); }}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={function (e) { setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder="Ask something or give a command..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={function () { handleSend(); }}
          className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
