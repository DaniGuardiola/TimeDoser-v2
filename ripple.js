var addRippleEffect = function (e) {
    var target = e.target;
    var type;
    if (target.id === 'fab') {
      type = "fast";
    } else {
      type = "show";
    }
    if (target.parentNode.classList.contains('rippleon')) {
      target = target.parentNode;
    } else if (target.classList.contains('rippleon') === false) {
      return false;
    }
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        /* CUSTOM */
        if (target.id === 'fab') {
          ripple.style.background = '#8bc34a';
          type = "fast";
        }
        target.appendChild(ripple);
    }
    ripple.classList.remove(type);
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add(type);
    return false;
}

document.addEventListener('mousedown', addRippleEffect, false);
