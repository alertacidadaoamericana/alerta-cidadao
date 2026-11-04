const trailMeta={
 digital:{title:"Golpes digitais",subtitle:"Pix, links, mensagens falsas e proteção de dados.",icon:"▣",lessons:["Desconfie de pedidos urgentes de transferência feitos por números desconhecidos.","Nunca compartilhe senhas, códigos de autenticação ou dados bancários.","Em caso de fraude, contate o banco pelos canais oficiais e preserve mensagens e comprovantes."]},
 mulher:{title:"Violência contra a mulher",subtitle:"Sinais de violência, direitos e caminhos de proteção.",icon:"◯",lessons:["A violência pode ser física, psicológica, sexual, patrimonial ou moral.","Ameaças, humilhações, isolamento e controle também exigem atenção.","Em perigo imediato, ligue 190. O Ligue 180 oferece orientação sobre direitos e serviços."]},
 idoso:{title:"Proteção da pessoa idosa",subtitle:"Prevenção de fraudes, abusos e violações de direitos.",icon:"♢",lessons:["Desconfie de pessoas que exigem cartões, senhas ou empréstimos em nome da pessoa idosa.","Negligência, abandono e violência patrimonial também são violações de direitos.","Preserve documentos e procure a rede de proteção ou os canais oficiais."]},
 infancia:{title:"Crianças e adolescentes",subtitle:"Proteção, acolhimento e rede responsável.",icon:"◎",lessons:["Escute a criança com acolhimento, sem exigir que ela repita detalhes.","Proteja sua identidade e procure o Conselho Tutelar ou a rede competente.","Em perigo imediato, acione o 190 e evite investigar ou confrontar suspeitos por conta própria."]},
 animais:{title:"Proteção animal",subtitle:"Responsabilidade, prevenção e comunicação segura.",icon:"♧",lessons:["Falta de água, alimento, abrigo ou cuidados pode indicar maus-tratos.","Registre informações de forma segura, sem invadir imóveis ou confrontar o responsável.","Animais feridos ou em sofrimento precisam de atendimento veterinário."]},
 acolhimento:{title:"Acolhimento emocional",subtitle:"Escuta respeitosa e acesso à rede de apoio.",icon:"♡",lessons:["Acolher é escutar sem julgamento, sem pressionar a pessoa por detalhes.","Respeite a autonomia da vítima e ajude a localizar atendimento especializado.","Em risco imediato, procure ajuda pelo 190 ou 192, conforme a situação."]}
};

const trailGrid=document.getElementById("trail-grid");
const trailStage=document.getElementById("trail-stage");
Object.entries(trailMeta).forEach(([key,item])=>{
 const button=document.createElement("button");
 button.type="button";button.className="trail-card";button.dataset.trail=key;button.id=key;
 button.innerHTML=`<span class="trail-icon">${item.icon}</span><h3>${item.title}</h3><p>${item.subtitle}</p><span class="trail-link">Abrir trilha <b>→</b></span>`;
 button.addEventListener("click",()=>openTrail(key));trailGrid.append(button);
});

function openTrail(key){
 document.querySelectorAll(".trail-card").forEach(card=>card.classList.toggle("active",card.dataset.trail===key));
 const item=trailMeta[key];
 trailStage.innerHTML=`<div class="trail-head"><div><h2>${item.title}</h2><p>${item.subtitle}</p></div><button class="close-trail" type="button" aria-label="Fechar trilha">×</button></div><div class="lesson-grid"><div class="lesson-copy"><h3>O que você precisa saber</h3><ul>${item.lessons.map(text=>`<li>${text}</li>`).join("")}</ul></div><div class="quiz-box" id="quiz-${key}"></div></div><p class="trail-disclaimer">Conteúdo educativo geral, sujeito a revisão jurídica. Não substitui orientação profissional, atendimento de emergência ou registro de ocorrência.</p>`;
 trailStage.querySelector(".close-trail").addEventListener("click",closeTrail);
 startQuiz(key,trailStage.querySelector(`#quiz-${key}`));
 trailStage.scrollIntoView({behavior:"smooth",block:"start"});
}
function closeTrail(){trailStage.replaceChildren();document.querySelectorAll(".trail-card").forEach(card=>card.classList.remove("active"));document.getElementById("trilhas").scrollIntoView({behavior:"smooth",block:"start"})}

function startQuiz(key,root){
 const questions=quizBank[key];let index=0,score=0;
 const render=()=>{
  if(index>=questions.length){root.innerHTML=`<p class="quiz-progress">TRILHA CONCLUÍDA</p><h3>Você acertou ${score} de ${questions.length} perguntas.</h3><p>O mais importante é reconhecer sinais de risco e saber onde buscar orientação.</p><button class="quiz-restart" type="button">Refazer quiz</button>`;root.querySelector("button").addEventListener("click",()=>{index=0;score=0;render()});return}
  const [question,options,correct,explanation]=questions[index];
  root.innerHTML=`<p class="quiz-progress">PERGUNTA ${index+1} DE ${questions.length} • ACERTOS: ${score}</p><h4>${question}</h4><div class="quiz-options"></div><div class="quiz-result" aria-live="polite"></div>`;
  const optionRoot=root.querySelector(".quiz-options");
  options.forEach((text,optionIndex)=>{
   const option=document.createElement("button");option.type="button";option.className="quiz-option";option.textContent=text;
   option.addEventListener("click",()=>{
    const isCorrect=optionIndex===correct;if(isCorrect)score++;
    optionRoot.querySelectorAll("button").forEach((current,currentIndex)=>{current.disabled=true;if(currentIndex===correct)current.classList.add("correct");else if(currentIndex===optionIndex)current.classList.add("incorrect")});
    const result=root.querySelector(".quiz-result");result.innerHTML=`<div class="quiz-feedback"><strong>${isCorrect?"Resposta correta!":"Veja a orientação recomendada"}</strong><p>${explanation}</p><button class="quiz-next" type="button">${index===questions.length-1?"Ver resultado":"Próxima pergunta →"}</button></div>`;
    result.querySelector("button").addEventListener("click",()=>{index++;render()});
   },{once:true});optionRoot.append(option);
  });
 };render();
}

const serviceGrid=document.getElementById("service-grid"),serviceSearch=document.getElementById("service-search"),serviceFilter=document.getElementById("service-filter"),serviceCount=document.getElementById("service-count");
function renderServices(){
 const term=serviceSearch.value.trim().toLocaleLowerCase("pt-BR"),category=serviceFilter.value;
 const shown=services.filter(service=>(category==="todos"||service.tags.includes(category))&&[service.name,service.type,service.desc,service.address].join(" ").toLocaleLowerCase("pt-BR").includes(term));
 serviceGrid.replaceChildren();serviceCount.textContent=`${shown.length} serviço(s) encontrado(s)`;
 if(!shown.length){serviceGrid.innerHTML='<p class="empty">Nenhum serviço encontrado. Tente outra palavra ou categoria.</p>';return}
 shown.forEach(service=>{
  const article=document.createElement("article");article.className="service-card";
  const mapLink=service.noMap?"":`<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}" target="_blank" rel="noopener noreferrer">Ver no mapa ↗</a>`;
  const callLink=service.phone?`<a class="alt" href="tel:${service.phone.replace(/\D/g,"")}">Ligar</a>`:"";
  article.innerHTML=`<div class="type">${service.type}</div><h3>${service.name}</h3><p>${service.desc}</p><p class="address">📍 ${service.address}</p>${service.phone?`<p>☎ ${service.phone}</p>`:""}<div class="service-actions">${mapLink}${callLink}</div><div class="verification">Contato, endereço e disponibilidade sujeitos a confirmação.</div>`;
  serviceGrid.append(article);
 });
}
serviceSearch.addEventListener("input",renderServices);serviceFilter.addEventListener("change",renderServices);renderServices();

const menuToggle=document.querySelector(".menu-toggle"),mainNav=document.getElementById("main-nav");
menuToggle.addEventListener("click",()=>{const open=menuToggle.getAttribute("aria-expanded")==="true";menuToggle.setAttribute("aria-expanded",String(!open));mainNav.classList.toggle("open",!open)});
mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{mainNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));
document.querySelectorAll("[data-path]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();openTrail(link.dataset.path)}));
