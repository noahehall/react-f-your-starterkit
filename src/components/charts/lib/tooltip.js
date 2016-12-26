import React from 'react';
import * as d3 from 'd3';

export class ToolTip extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    // single tooltip used for all charts
    const appToolTip = d3
      .select('body')
      .append('section')
      .style('background', 'black')
      .style('border', '2px red dashed')
      .style('borderRadius', '4px')
      .style('opacity', 0)
      .style('padding', '10px')
      .style('position', 'absolute');

    // this needs to be inside somed3Component.on() mouseover & click
    const appToolTipTransition = d3
              .transition()
              .duration(250)
              .delay(100)
              .ease(d3.easePolyIn);

    try{
      appToolTip
        .transition(appToolTipTransition)
        .style('opacity', 1)
        .style('color', 'white')
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY}px`);
    } catch (err) {
              // do nothing on err when too many interrupts of transitions
    }

    appToolTip
      .html(d);

    // this needs to be inside somed3Component.on() mouseout
    try { // eslintignore if too many transitions, will throw err, read https://github.com/d3/d3-transition#the-life-of-a-transition
      appToolTip
        .transition(appToolTipTransition)
        .style('opacity', 0);
    } catch (err) {
      appFuncs.console('dir')(err);
    }
  }
}

/*
// single tooltip used for all charts
const appToolTip = d3.select(`#${this.props.id}-tooltip`);

// consoles the data associated with the specific bar
barChart.on('click', (d) => appFuncs.console('dir')(d));
// changes fill color on mouseover
barChart.on('mouseover', function (d) { // eslint-disable-line
  const barColor = this.style.fill; // eslint-disable-line
  const thisItem = d3.select(this)
    .style('opacity', 0.7)
    .style('fill', 'green');

  // transition on
  const appToolTipTransitionOn = d3
    .transition()
    .duration(250)
    .delay(100)
    .ease(d3.easePolyIn);

  // transition off
  const appToolTipTransitionOff = d3
    .transition()
    .duration(100)
    .delay(100)
    .ease(d3.easePolyIn);

  try{
    appToolTip
      .transition(appToolTipTransitionOn)
      .style('opacity', 1)
      .style('color', 'white')
      .style('left', `${d3.event.pageX}px`)
      .style('top', `${d3.event.pageY}px`);
  } catch (err) {
    appFuncs.console('dir')(err);
  }

  appToolTip
    .html(d);

  thisItem.on('mouseout', function () { // eslint-disable-line
    thisItem
      .style('opacity', 1)
      .style('fill', barColor);

    try {
      // eslintignore if too many transitions, will throw err, read https://github.com/d3/d3-transition#the-life-of-a-transition
      d3.interrupt(appToolTip, appToolTipTransitionOn);

      if (appToolTip.style('opacity'))
        appToolTip
          .transition(appToolTipTransitionOff)
          .style('opacity', 0);
    } catch (err) {
      appFuncs.console('dir')(err);
    }
  });
});

 */
