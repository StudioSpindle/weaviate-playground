import React from 'react';

/**
 * Link component is responsible for encapsulating link render.
 * @example
 * const onClickLink = function(source, target) {
 *      window.alert(`Clicked link between ${source} and ${target}`);
 * };
 *
 * const onRightClickLink = function(source, target) {
 *      window.alert(`Right clicked link between ${source} and ${target}`);
 * };
 *
 * const onMouseOverLink = function(source, target) {
 *      window.alert(`Mouse over in link between ${source} and ${target}`);
 * };
 *
 * const onMouseOutLink = function(source, target) {
 *      window.alert(`Mouse out link between ${source} and ${target}`);
 * };
 *
 * <Link
 *     d="M1..."
 *     source='idSourceNode'
 *     target='idTargetNode'
 *     markerId='marker-small'
 *     strokeWidth=1.5
 *     stroke='green'
 *     className='link'
 *     opacity=1
 *     mouseCursor='pointer'
 *     onClickLink={onClickLink}
 *     onRightClickLink={onRightClickLink}
 *     onMouseOverLink={onMouseOverLink}
 *     onMouseOutLink={onMouseOutLink} />
 */
export default class Link extends React.Component {
  /**
   * Handle link click event.
   * @returns {undefined}
   */
  handleOnClickLink = () =>
    this.props.onClickLink &&
    this.props.onClickLink (this.props.source, this.props.target);

  /**
   * Handle link right click event.
   * @param {Object} event - native event.
   * @returns {undefined}
   */
  handleOnRightClickLink = event =>
    this.props.onRightClickLink &&
    this.props.onRightClickLink (event, this.props.source, this.props.target);

  /**
   * Handle mouse over link event.
   * @returns {undefined}
   */
  handleOnMouseOverLink = () =>
    this.props.onMouseOverLink &&
    this.props.onMouseOverLink (this.props.source, this.props.target);

  /**
   * Handle mouse out link event.
   * @returns {undefined}
   */
  handleOnMouseOutLink = () =>
    this.props.onMouseOutLink &&
    this.props.onMouseOutLink (this.props.source, this.props.target);

  render () {
    const {
      className,
      d,
      markerId,
      mouseCursor,
      opacity,
      stroke,
      strokeWidth,
      source,
      target,
    } = this.props;
    const markerWidth = 200;
    const markerHeight = 60;
    const fontSize = 30;

    const lineStyle = {
      cursor: mouseCursor,
      fill: 'none',
      opacity,
      stroke,
      strokeWidth,
    };

    const rectStyle = {
      cursor: mouseCursor,
      fill: 'white',
      opacity,
      stroke,
      strokeWidth,
    };

    const randomId = this.props.id || `${source}-${target}`;

    const lineProps = {
      className,
      d,
      markerMid: `url(#${randomId})`,
      onClick: this.handleOnClickLink,
      onContextMenu: this.handleOnRightClickLink,
      onMouseOut: this.handleOnMouseOutLink,
      onMouseOver: this.handleOnMouseOverLink,
      style: lineStyle,
    };

    if (markerId) {
      lineProps.markerEnd = `url(#${markerId})`;
    }

    return (
      <React.Fragment>
        <defs>
          <marker
            id={randomId}
            viewBox={`0 0 ${markerHeight} ${markerWidth}`}
            refX={markerWidth / 2}
            refY={markerHeight / 2}
            markerWidth={markerWidth}
            markerHeight={markerHeight}
          >
            <rect
              x={strokeWidth}
              y={strokeWidth}
              width={markerWidth - 2 * strokeWidth}
              height={markerHeight - 2 * strokeWidth}
              rx="10"
              ry="10"
              style={rectStyle}
            />
            <text
              x={fontSize * 2}
              y={(markerHeight - fontSize) / 3 + fontSize}
              width={markerWidth - 2 * strokeWidth}
              height={markerHeight - 2 * strokeWidth}
              fontFamily="Alegreya Sans"
              fontWeight="bold"
              fontSize={fontSize}
              fill="black"
            >
              OfficeIn
            </text>
          </marker>
        </defs>
        <path {...lineProps} />
      </React.Fragment>
    );
  }
}
