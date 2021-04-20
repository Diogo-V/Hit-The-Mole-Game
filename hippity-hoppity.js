// Draw target on-screen
function drawTarget(i)
{
  // Get the location and size for target (i)
  let target = getTargetBounds(i);

  let nextTarget = getTargetBounds(trials[current_trial+1]);

  // Check whether this target is the target the user should be trying to select
  if (trials[current_trial] === i)
  {
    // Arrow
    if (nextTarget.y != target.y || nextTarget.x != target.x){

      angleMode(RADIANS);
      fill(color(255,0,0));
      //stroke(color(220,220,220));
      translate(target.x, target.y);

      if (nextTarget.y-target.y === 0){
        if (nextTarget.x-target.x < 0){
          rotate(PI);
        }else if (nextTarget.x-target.x > 0){
          rotate(0);
        }

      }else if (nextTarget.x-target.x < 0){
        rotate(PI+Math.atan((nextTarget.y-target.y)/(nextTarget.x-target.x)));

      }else{
        rotate(Math.atan((nextTarget.y-target.y)/(nextTarget.x-target.x)));
      }


    triangle(target.w, 0,
             (target.w/2)+5,-(target.w/4),
             (target.w/2)+5,(target.w/4));



      if (nextTarget.y-target.y === 0){
        if (nextTarget.x-target.x < 0){
          rotate(-PI);
        }else if (nextTarget.x-target.x > 0){
          rotate(0);
        }

      }else if (nextTarget.x-target.x < 0){
        rotate(-PI-Math.atan((nextTarget.y-target.y)/(nextTarget.x-target.x)));

      }else{
        rotate(-Math.atan((nextTarget.y-target.y)/(nextTarget.x-target.x)));
      }

      translate(-target.x, -target.y);
    }

    // Pulse next target
    if(pulse === true && step < (3.14/2))
    {
      stroke(color(255,0,0));
      strokeWeight(1+2*(sin(step)));
      step = step + 0.08;
    }
    else
    {
      pulse = false;
      if(step > -(3.14/2))
      {
        stroke(color(255,0,0));
        strokeWeight(1+2*(sin(step)));
        step = step - 0.08;
      }
      else
      {
        noStroke();
      }
    }

    // Paints next target
    fill(color(0,255,0));
    circle(target.x, target.y, target.w);

    // Remember you are allowed to access targets (i-1) and (i+1)
    // if this is the target the user should be trying to select
    //
  }
  // Does not draw a border if this is not the target the user
  // should be trying to select
  else
  {
    noStroke();

    fill(color(155,155,155));
    circle(target.x, target.y, target.w);
  }

  // Calculates Fitts
  if(current_trial === 0)
  {
    fitts_IDs[current_trial] = "-----";
  }
  else
  {
    let distance = dist(mouseX, mouseY, target.x, target.y);
    let wide = target.w;
    fitts_IDs[current_trial] = round((log((distance/wide) + 1) / log(2)), 3);
  }
}
