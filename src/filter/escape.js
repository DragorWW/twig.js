module.exports = function(value, params) {
  if (value === undefined|| value === null){
    return;
  }

  var strategy = "html";
  if(params && params.length && params[0] !== true)
    strategy = params[0];

  if(strategy == "html") {
    var raw_value = value.toString().replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
    return Twig.Markup(raw_value, 'html');
  } else if(strategy == "js") {
    var raw_value = value.toString();
    var result = "";

    for(var i = 0; i < raw_value.length; i++) {
      if(raw_value[i].match(/^[a-zA-Z0-9,\._]$/))
        result += raw_value[i];
      else {
        var char_code = raw_value.charCodeAt(i);

        if(char_code < 0x80)
          result += "\\x" + char_code.toString(16).toUpperCase();
        else
          result += Twig.lib.sprintf("\\u%04s", char_code.toString(16).toUpperCase());
      }
    }

    return Twig.Markup(result, 'js');
  } else if(strategy == "css") {
    var raw_value = value.toString();
    var result = "";

    for(var i = 0; i < raw_value.length; i++) {
      if(raw_value[i].match(/^[a-zA-Z0-9]$/))
        result += raw_value[i];
      else {
        var char_code = raw_value.charCodeAt(i);
        result += "\\" + char_code.toString(16).toUpperCase() + " ";
      }
    }

    return Twig.Markup(result, 'css');
  } else if(strategy == "url") {
    var result = Twig.filters.url_encode(value);
    return Twig.Markup(result, 'url');
  } else if(strategy == "html_attr") {
    var raw_value = value.toString();
    var result = "";

    for(var i = 0; i < raw_value.length; i++) {
      if(raw_value[i].match(/^[a-zA-Z0-9,\.\-_]$/))
        result += raw_value[i];
      else if(raw_value[i].match(/^[&<>"]$/))
        result += raw_value[i].replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      else {
        var char_code = raw_value.charCodeAt(i);

        // The following replaces characters undefined in HTML with
        // the hex entity for the Unicode replacement character.
        if(char_code <= 0x1f && char_code != 0x09 && char_code != 0x0a && char_code != 0x0d)
          result += "&#xFFFD;";
        else if(char_code < 0x80)
          result += Twig.lib.sprintf("&#x%02s;", char_code.toString(16).toUpperCase());
        else
          result += Twig.lib.sprintf("&#x%04s;", char_code.toString(16).toUpperCase());
      }
    }

    return Twig.Markup(result, 'html_attr');
  } else {
    throw new Twig.Error("escape strategy unsupported");
  }
}