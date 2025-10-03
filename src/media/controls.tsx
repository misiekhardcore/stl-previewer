const buttons = ["isometric", "top", "left", "right", "bottom"] as const;

interface ControlsProps {
  onButtonClick: (button: (typeof buttons)[number]) => void;
}

export function Controls({ onButtonClick }: ControlsProps) {
  return (
    <div className="controls">
      {buttons.map((button) => (
        <button
          className={`button button--${button}`}
          key={button}
          onClick={() => onButtonClick(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
}
