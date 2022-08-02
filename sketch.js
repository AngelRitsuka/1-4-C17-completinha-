var PLAY = 1;
var END = 0;
var gameState = PLAY;
//variavel do sprite trex + imagem inicial do trex
var trex, trex_running;
//variavel que vamos colocar a imagem
var trex_collided;
//Chão + chão invisivel + imagem do chão normal
var ground, invisibleGround, groundImage;

//grupo de nuvens + imagem da nuvem
var cloudsGroup, cloudImage;
//grupo de obstaculos + imagem de cada obstaculo diferente
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//pontuação
var score;

//imagem do game over + imagem do botão restart
var gameOverImg,restartImg

//carregar sons, imagens, animações
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  //carregar a animação do trex_collided
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  //adicionar a animação do trex_collided
  trex.addAnimation("boca no cacto", trex_collided);
  //ajustar o raio de colisão do trex
  //"formato", x,y,largura,altura/raio, rotação
  trex.setCollider("circle",0,0,40);
  //ativar o raio de colisão (true)
  trex.debug = false;

  //chão
  ground = createSprite(200,180,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width /2;
  
  //game over e adicionar a imagem nele
    gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //restart e adicionar a imagem nele
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Olá" + 5);
  
  score = 0;
}

function draw() {
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
     gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = -4;
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -13;
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

  }
   else if (gameState === END) {
      ground.velocityX = 0;


      gameOver.visible = true;
      restart.visible = true;

      ground.velocityX = 0;
      trex.velocityY = 0

      //mudar a animação do trex
      trex.changeAnimation("boca no cacto", trex_collided);

      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);


     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6;
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos              
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 134;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

