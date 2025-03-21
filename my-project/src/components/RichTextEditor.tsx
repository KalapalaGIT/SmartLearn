import {
  useEditor,
  EditorContent,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Typography from "@tiptap/extension-typography";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import "highlight.js/styles/atom-one-light.css";
import "./richTextEditor.css"; // Import the CSS file

const lowlight = createLowlight();
lowlight.register("js", js);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("cpp", cpp);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Helper component to display keyboard shortcut information
const ShortcutInfo = () => {
  const [isVisible, setIsVisible] =
    useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 rounded hover:bg-white"
        title="Keyboard shortcuts"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="3"
            y="11"
            width="18"
            height="10"
            rx="2"
          />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="12" y1="16" x2="12" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      </button>

      {isVisible && (
        <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-80 p-4">
          <h3 className="text-sm font-semibold mb-2">
            Keyboard Shortcuts
          </h3>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>
                Type <code>/</code> then select an
                option
              </span>
              <span>Open command menu</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+1</code>
              </span>
              <span>Heading 1</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+2</code>
              </span>
              <span>Heading 2</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+3</code>
              </span>
              <span>Heading 3</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+8</code>
              </span>
              <span>Bullet list</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+7</code>
              </span>
              <span>Numbered list</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+9</code>
              </span>
              <span>Task list</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+C</code>
              </span>
              <span>Code block</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>Ctrl+Shift+B</code>
              </span>
              <span>Quote</span>
            </div>
            <div className="flex justify-between">
              <span>
                Type <code>/h1</code> then{" "}
                <code>Tab</code>
              </span>
              <span>Heading 1</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>**text**</code> or{" "}
                <code>__text__</code>
              </span>
              <span>Bold</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>*text*</code> or{" "}
                <code>_text_</code>
              </span>
              <span>Italic</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>==text==</code>
              </span>
              <span>Highlight</span>
            </div>
            <div className="flex justify-between">
              <span>
                <code>`code`</code>
              </span>
              <span>Inline code</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Slash commands menu component
interface Command {
  title: string;
  icon: string;
  description: string;
  shortcut?: string;
  command: (editor: Editor) => void;
}

interface SlashCommandsProps {
  editor: Editor;
  isActive: boolean;
  position: { top: number; left: number };
  commands: Command[];
  query: string;
  onSelect: (command: Command) => void;
}

const SlashCommands = ({
  editor,
  isActive,
  position,
  commands,
  query,
  onSelect,
}: SlashCommandsProps) => {
  const [selectedIndex, setSelectedIndex] =
    useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Enhanced filter commands based on query and keywords
  const filteredCommands = useMemo(() => {
    if (!query) return commands;

    const normalizedQuery = query
      .toLowerCase()
      .trim();

    return commands.filter((command) => {
      // Check title
      if (
        command.title
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        return true;
      }

      // Check description
      if (
        command.description
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        return true;
      }

      // Check keywords (specifically for 'list')
      if (normalizedQuery === "list") {
        return command.title
          .toLowerCase()
          .includes("list");
      }

      // Special cases for common queries
      if (
        normalizedQuery === "list" &&
        (command.title === "Bullet List" ||
          command.title === "Numbered List" ||
          command.title === "Task List")
      ) {
        return true;
      }

      if (
        normalizedQuery === "heading" &&
        (command.title === "Heading 1" ||
          command.title === "Heading 2" ||
          command.title === "Heading 3")
      ) {
        return true;
      }

      return false;
    });
  }, [commands, query]);

  // Handle arrow key navigation and selection
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredCommands.length - 1
            ? prevIndex + 1
            : prevIndex
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0
            ? prevIndex - 1
            : prevIndex
        );
      } else if (
        e.key === "Enter" ||
        e.key === "Tab"
      ) {
        e.preventDefault();
        e.stopPropagation();

        if (filteredCommands[selectedIndex]) {
          onSelect(
            filteredCommands[selectedIndex]
          );
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        editor.commands.focus();
      }
    },
    [
      isActive,
      filteredCommands,
      selectedIndex,
      onSelect,
      editor,
    ]
  );

  // Add event listener
  useEffect(() => {
    if (isActive) {
      // Use capturing phase to intercept events before they reach the editor
      document.addEventListener(
        "keydown",
        handleKeyDown,
        true
      );
      return () => {
        document.removeEventListener(
          "keydown",
          handleKeyDown,
          true
        );
      };
    }
  }, [isActive, handleKeyDown]);

  // Reset selected index when the list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  if (!isActive || filteredCommands.length === 0)
    return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white rounded-md shadow-lg z-10 w-72 max-h-72 overflow-y-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="p-2">
        <h3 className="text-xs text-gray-500 font-medium mb-2">
          {query
            ? `Results for "${query}"`
            : "Commands"}
        </h3>
        {filteredCommands.length === 0 ? (
          <div className="text-sm text-gray-500 p-2">
            No matching commands found
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredCommands.map(
              (item, index) => (
                <li
                  key={item.title}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    index === selectedIndex
                      ? "bg-indigo-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect(item);
                  }}
                  onMouseEnter={() =>
                    setSelectedIndex(index)
                  }
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 text-gray-600 flex items-center justify-center"
                    dangerouslySetInnerHTML={{
                      __html: item.icon,
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                  {item.shortcut && (
                    <div className="flex-shrink-0">
                      <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.shortcut}
                      </kbd>
                    </div>
                  )}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

const RichTextEditor = ({
  content,
  onChange,
}: RichTextEditorProps) => {
  // Debounce timer reference
  const debounceTimerRef =
    useRef<NodeJS.Timeout | null>(null);
  // Track if content is being set programmatically
  const isSettingContent = useRef(false);
  // Track slash command state
  const [
    slashCommandState,
    setSlashCommandState,
  ] = useState({
    isActive: false,
    query: "",
    position: { top: 0, left: 0 },
  });
  const [isFullScreen, setIsFullScreen] =
    useState(false);

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    (html: string) => {
      if (isSettingContent.current) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(
        () => {
          onChange(html);
        },
        300
      );
    },
    [onChange]
  );

  // Define our slash commands with shortcuts and keywords
  const slashCommands: Command[] = [
    {
      title: "Heading 1",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"></path><path d="M4 18h16"></path><path d="M4 6h16"></path></svg>',
      description: "Large section heading",
      shortcut: "Ctrl+Shift+1",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .setNode("heading", { level: 1 })
          .run(),
    },
    {
      title: "Heading 2",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"></path><path d="M4 18h16"></path><path d="M4 6h16"></path></svg>',
      description: "Medium section heading",
      shortcut: "Ctrl+Shift+2",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .setNode("heading", { level: 2 })
          .run(),
    },
    {
      title: "Heading 3",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"></path><path d="M4 18h16"></path><path d="M4 6h16"></path></svg>',
      description: "Small section heading",
      shortcut: "Ctrl+Shift+3",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .setNode("heading", { level: 3 })
          .run(),
    },
    {
      title: "Bullet List",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
      description: "Simple bullet list",
      shortcut: "Ctrl+Shift+8",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .toggleBulletList()
          .run(),
    },
    {
      title: "Numbered List",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>',
      description: "Numbered list",
      shortcut: "Ctrl+Shift+7",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .toggleOrderedList()
          .run(),
    },
    {
      title: "Task List",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="14" x2="15" y2="14"></line><line x1="9" y1="19" x2="15" y2="19"></line></svg>',
      description: "To-do list with checkboxes",
      shortcut: "Ctrl+Shift+9",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .toggleTaskList()
          .run(),
    },
    {
      title: "Code Block",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
      description:
        "Display code with syntax highlighting",
      shortcut: "Ctrl+Shift+C",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .toggleCodeBlock()
          .run(),
    },
    {
      title: "Quote",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>',
      description: "Blockquote",
      shortcut: "Ctrl+Shift+B",
      command: (editor) =>
        editor
          .chain()
          .focus()
          .toggleBlockquote()
          .run(),
    },
  ];

  // Handle tab shortcuts for quick insertion
  const handleTabShortcuts = (
    event: KeyboardEvent,
    editor: Editor
  ) => {
    const { from } = editor.state.selection;
    const text = editor.state.doc.textBetween(
      Math.max(0, from - 10),
      from,
      " "
    );

    if (event.key === "Tab") {
      // Handle slash command shortcuts like /h1, /bullet, etc.
      if (text.includes("/")) {
        const commandText = text.substring(
          text.lastIndexOf("/") + 1
        );

        if (commandText === "h1") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .setNode("heading", { level: 1 })
            .run();
          return true;
        } else if (commandText === "h2") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .setNode("heading", { level: 2 })
            .run();
          return true;
        } else if (commandText === "h3") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .setNode("heading", { level: 3 })
            .run();
          return true;
        } else if (commandText === "bullet") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run();
          return true;
        } else if (commandText === "numbered") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run();
          return true;
        } else if (commandText === "task") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .toggleTaskList()
            .run();
          return true;
        } else if (commandText === "code") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .toggleCodeBlock()
            .run();
          return true;
        } else if (commandText === "quote") {
          event.preventDefault();
          editor.commands.deleteRange({
            from: from - commandText.length - 1,
            to: from,
          });
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run();
          return true;
        }
      }
    }

    return false;
  };

  // Handle Ctrl+Shift+number keyboard shortcuts
  const handleKeyboardShortcuts = (
    event: KeyboardEvent
  ) => {
    if (!editor) return false;

    if (event.ctrlKey && event.shiftKey) {
      if (event.key === "1") {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .setNode("heading", { level: 1 })
          .run();
        return true;
      } else if (event.key === "2") {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .setNode("heading", { level: 2 })
          .run();
        return true;
      } else if (event.key === "3") {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .setNode("heading", { level: 3 })
          .run();
        return true;
      } else if (
        event.key === "8" ||
        event.key === "*"
      ) {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .toggleBulletList()
          .run();
        return true;
      } else if (
        event.key === "7" ||
        event.key === "&"
      ) {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .toggleOrderedList()
          .run();
        return true;
      } else if (
        event.key === "9" ||
        event.key === "("
      ) {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .toggleTaskList()
          .run();
        return true;
      } else if (
        event.key === "c" ||
        event.key === "C"
      ) {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .toggleCodeBlock()
          .run();
        return true;
      } else if (
        event.key === "b" ||
        event.key === "B"
      ) {
        event.preventDefault();
        editor
          .chain()
          .focus()
          .toggleBlockquote()
          .run();
        return true;
      }
    }
    return false;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "code-block",
          },
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Highlight.configure({
        multicolor: false,
      }),
      Placeholder.configure({
        placeholder:
          "Start writing... or type '/' for commands",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      Typography,
      TextStyle,
      Color,
    ],
    content,
    editorProps: {
      handleKeyDown: (view, event) => {
        // Skip further handling if the slash menu is active
        if (slashCommandState.isActive) {
          return false;
        }

        // Handle keyboard shortcuts
        if (handleKeyboardShortcuts(event)) {
          return true;
        }

        // Handle tab shortcuts
        if (
          handleTabShortcuts(
            event,
            editor as Editor
          )
        ) {
          return true;
        }

        // Handle slash commands activation
        if (event.key === "/") {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // Calculate position for slash commands menu
          const coords = view.coordsAtPos(
            $from.pos
          );
          const editorElement =
            view.dom.getBoundingClientRect();
          const left =
            coords.left - editorElement.left;
          const top =
            coords.top - editorElement.top + 24; // Add some offset to position below cursor

          setSlashCommandState({
            isActive: true,
            query: "",
            position: { top, left },
          });
        }

        // Track slash command query
        if (slashCommandState.isActive) {
          if (event.key === "Escape") {
            setSlashCommandState((prev) => ({
              ...prev,
              isActive: false,
            }));
            return false;
          }

          // Update query after slash is typed
          if (
            event.key !== "/" &&
            !/^Arrow/.test(event.key) &&
            event.key !== "Enter" &&
            event.key !== "Tab"
          ) {
            setTimeout(() => {
              const { from } =
                editor!.state.selection;
              const textUntilCursor =
                editor!.state.doc.textBetween(
                  Math.max(0, from - 100), // Look back up to 100 chars
                  from,
                  " "
                );

              const match =
                textUntilCursor.match(
                  /\/([^/\s]*)$/
                );

              if (match) {
                const query = match[1];
                setSlashCommandState((prev) => ({
                  ...prev,
                  query: query || "",
                }));
              } else {
                setSlashCommandState((prev) => ({
                  ...prev,
                  isActive: false,
                }));
              }
            }, 0);
          }
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      if (!isSettingContent.current) {
        debouncedOnChange(editor.getHTML());
      }
    },
  });

  // Handle slash command selection with completely reworked approach
  const handleSlashCommandSelect = useCallback(
    (command: Command) => {
      if (!editor) return;

      // Get current position and text
      const { selection } = editor.state;
      const { from } = selection;
      const text = editor.state.doc.textBetween(
        Math.max(0, from - 100),
        from,
        " "
      );
      const match = text.match(/\/([^/\s]*)$/);

      // Store current selection as a transaction
      editor.view.dispatch(
        editor.state.tr.setSelection(selection)
      );

      if (match) {
        // Use transaction to delete the slash command text
        const startPos = from - match[0].length;
        editor
          .chain()
          .focus()
          .deleteRange({
            from: startPos,
            to: from,
          })
          .run();

        // Now execute the command
        command.command(editor);

        // Explicitly set focus to maintain cursor position
        setTimeout(() => {
          editor.commands.focus();
        }, 0);
      } else {
        // Just execute the command if no slash text found
        command.command(editor);
      }

      // Close the menu
      setSlashCommandState((prev) => ({
        ...prev,
        isActive: false,
      }));
    },
    [editor]
  );

  // Parse HTML content whenever it changes from outside
  useEffect(() => {
    if (
      editor &&
      content &&
      editor.getHTML() !== content
    ) {
      isSettingContent.current = true;
      editor.commands.setContent(content);
      // Give time for the editor to update before allowing further changes
      setTimeout(() => {
        isSettingContent.current = false;
      }, 50);
    }
  }, [content, editor]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Improved query tracking for slash commands
  useEffect(() => {
    if (editor && slashCommandState.isActive) {
      const handleSlashQueryUpdate = () => {
        const { from } = editor.state.selection;
        const textUntilCursor =
          editor.state.doc.textBetween(
            Math.max(0, from - 100), // Look back up to 100 chars
            from,
            " "
          );

        const match =
          textUntilCursor.match(/\/([^/\s]*)$/);

        if (match) {
          const query = match[1];
          setSlashCommandState((prev) => ({
            ...prev,
            query: query || "",
          }));
        } else {
          setSlashCommandState((prev) => ({
            ...prev,
            isActive: false,
          }));
        }
      };

      // Set up a MutationObserver to track changes to the editor content
      const editorElement =
        document.querySelector(".ProseMirror");
      if (editorElement) {
        const observer = new MutationObserver(
          handleSlashQueryUpdate
        );
        observer.observe(editorElement, {
          childList: true,
          subtree: true,
          characterData: true,
        });

        return () => {
          observer.disconnect();
        };
      }
    }
  }, [editor, slashCommandState.isActive]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-lg ${
        isFullScreen
          ? "fixed inset-0 z-50"
          : "h-full border border-gray-200"
      }`}
    >
      <div className="border-b border-gray-200 p-3 flex gap-2 flex-wrap items-center bg-white">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run()
            }
            className={`p-1.5 rounded-md text-sm font-medium ${
              editor.isActive("heading", {
                level: 1,
              })
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            H1
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
            className={`p-1.5 rounded-md text-sm font-medium ${
              editor.isActive("heading", {
                level: 2,
              })
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            H2
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run()
            }
            className={`p-1.5 rounded-md text-sm font-medium ${
              editor.isActive("heading", {
                level: 3,
              })
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            H3
          </button>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("bold")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("italic")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="19"
                y1="4"
                x2="10"
                y2="4"
              ></line>
              <line
                x1="14"
                y1="20"
                x2="5"
                y2="20"
              ></line>
              <line
                x1="15"
                y1="4"
                x2="9"
                y2="20"
              ></line>
            </svg>
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHighlight()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("highlight")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("bulletList")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="8"
                y1="6"
                x2="21"
                y2="6"
              ></line>
              <line
                x1="8"
                y1="12"
                x2="21"
                y2="12"
              ></line>
              <line
                x1="8"
                y1="18"
                x2="21"
                y2="18"
              ></line>
              <line
                x1="3"
                y1="6"
                x2="3.01"
                y2="6"
              ></line>
              <line
                x1="3"
                y1="12"
                x2="3.01"
                y2="12"
              ></line>
              <line
                x1="3"
                y1="18"
                x2="3.01"
                y2="18"
              ></line>
            </svg>
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("orderedList")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="10"
                y1="6"
                x2="21"
                y2="6"
              ></line>
              <line
                x1="10"
                y1="12"
                x2="21"
                y2="12"
              ></line>
              <line
                x1="10"
                y1="18"
                x2="21"
                y2="18"
              ></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          </button>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleTaskList()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("taskList")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleCodeBlock()
                .run()
            }
            className={`p-1.5 rounded-md ${
              editor.isActive("codeBlock")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() =>
              setIsFullScreen(!isFullScreen)
            }
            className={`p-1.5 rounded-md text-gray-700 hover:bg-gray-100`}
            title={
              isFullScreen
                ? "Exit full screen"
                : "Enter full screen"
            }
          >
            {isFullScreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8V3h5M21 8V3h-5M3 16v5h5m13-5v5h-5"></path>
              </svg>
            )}
          </button>
          <ShortcutInfo />
        </div>
      </div>

      <div className="flex-1 overflow-auto relative bg-gray-50">
        <div
          className={`h-full bg-white ${
            isFullScreen
              ? "max-w-5xl mx-auto shadow-sm"
              : ""
          }`}
        >
          <EditorContent
            editor={editor}
            className="prose max-w-none h-full px-6 py-4 focus:outline-none"
          />

          {/* Slash Commands Menu */}
          <SlashCommands
            editor={editor}
            isActive={slashCommandState.isActive}
            position={slashCommandState.position}
            commands={slashCommands}
            query={slashCommandState.query}
            onSelect={handleSlashCommandSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
