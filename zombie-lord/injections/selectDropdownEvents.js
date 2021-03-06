/*
  This provides event for
  select box opening and select box closing
  to enable UI to be rendered on the client

  The select box opens:
  - on a click
  - if it has focus and space key is pressed
  - if it has focus and enter key is pressed

  The select box closes:
  - when it loses focus
  - on a click
  - if enter key is pressed
*/

{
  let closed = true;

  install();

  function install() {
    self.addEventListener('click', monitorSelectEvents, {capture: true});
    self.addEventListener('keydown', monitorSelectEvents, {capture: true});
  }

  function monitorSelectEvents(e) {
    const {target} = e;
    const condition = !!target && target.matches && target.matches('select:not([multiple])');
    if ( ! condition ) return;

    if ( e.type == "keydown" ) {
      const id = e.key && e.key.length > 1 ? e.key : e.code;
      if ( closed ) {
        if ( id == "Space" || id == "Enter" ) {
          open(target);
        }
      } else {
        if ( id == "Enter" || id == "Tab" ) {
          close(target);
        }
      }
    } else if ( e.type == "click" ) {
      if ( closed ) {
        open(target);
      } else {
        close(target);
      }
    }

    if ( ! closed ) {
      target.addEventListener('blur', () => close(target), {capture:true, once:true});
    }
  }

  function open(selectEl) {
    closed = false;
    s({selectOpen:true, values:getSelectInside(selectEl)});
    self.setSelectValue = makeValueSetter(selectEl);
  }

  function close(selectEl) {
    closed = true;
    s({selectOpen:false});
  }

  function getSelectInside(selectEl) {
    return selectEl.innerHTML;  
  }

  function makeValueSetter(selectEl) {
    return function( val ) {
      console.log(`Setting value of ${selectEl} to ${val}`);
      const optionElem = selectEl.querySelector(`[value="${val}"]`);
      optionElem.selected = true;
      selectEl.value = val;
      selectEl.dispatchEvent(new Event('change', {bubbles:true, isTrusted:true}));
      selectEl.blur();
    }
  }

  function s(o) {
    console.log(JSON.stringify({selectInput:o}));
  }
}
