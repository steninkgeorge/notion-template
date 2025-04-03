import { SuggestionProps } from "@tiptap/suggestion";
import { Component } from "react";

class CommandsView extends Component<SuggestionProps> {
  state = {
    selectedIndex: 0,
  };

  
  componentDidUpdate(oldProps: SuggestionProps) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        ((this.state.selectedIndex || 0) + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    console.log(this.props.items.length)
    this.setState({
      selectedIndex:
        this.state.selectedIndex === null
          ? 0
          : ((this.state.selectedIndex || 0) + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    console.log('enterhandler')
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index: number | null) {
    const item = this.props.items[index || 0];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <div className="insert-menu flex flex-col  bg-white shadow-lg rounded-lg min-w-40 border-none border-gray-300">
        {items.map((item, index) => {
          return (
            <button
              type="button"
              className=" hover:bg-neutral-100 rounded-sm font-light text-md items-center flex justify-start"
              key={index}
              onClick={() => this.selectItem(index)}
            >
              <div className="px-1 m-1">{item.element || item.title}</div>
            </button>
          );
        })}
      </div>
    );
  }
}


export default CommandsView