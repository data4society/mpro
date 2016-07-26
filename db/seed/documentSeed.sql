-- seed documents:

insert into records(document_id, guid, training, title, schema_name, schema_version, version, published, created, edited, edited_by, rubrics, content, meta)
values (
  '1',
  'http://www.nytimes.com/1993/12/09/arts/jim-morrison-s-fans-keep-his-fire-alight-in-a-birthday-homage.html',
  'false',
  E'Jim Morrison\'s Fans Keep His Fire Alight In a Birthday Homage',
  'mpro-article',
  '1.0.0',
  4,
  '1993-12-09T08:00:00.000Z',
  NOW(),
  NOW(),
  'testuser',
  '{2,3}',
  E'{"schema":{"name":"mpro-article","version":"1.0.0"},"nodes":[{"type":"container","id":"body","nodes":["paragraph-ecaf8bfa8182405942f7b9ab0091aa3e","paragraph-8f6a4f8a592e139653e69f10ebb1063e","paragraph-be2d8c9df8787e1b8237c72bc97a5d48","paragraph-552c9445c0847076e9f323b18b668437","paragraph-722c16cd7d533b6d41c2f1fd2a36c9a5","paragraph-99a78fbb33439383a25f5438f488568f","paragraph-39bcfc04692a854641546142fc8da08e","paragraph-fabeb25f07e8b07740e0e95542e3c28f","paragraph-911e785d1aaaa1652f92e4f446703b7d","paragraph-9f53c8542d56e297fd831a1f583b06e4","paragraph-4b33e71bbf1b5dfe4c8c21acd724463a","paragraph-c2555c873a196b4f4f2bb1325b55a1f3","paragraph-969de715b61586f4b7aa0be1ecf722a2","paragraph-e2bf1e3a4d4e1eae6250902d5af681b6","paragraph-78342b2b07deb8da53b9a42fde74da19","paragraph-afd6d0cd6270cf6e61f5b37b240865af","paragraph-165fc962bc1362937ea37718c385c0d5","paragraph-57cc60086beeafa91f217126bb59dd64","paragraph-6e47b1dfa6721aa204308b9230ae2580"]},{"type":"meta","id":"meta","title":"Jim Morrison''s Fans Keep His Fire Alight In a Birthday Homage","rubrics":["2","3"]},{"type":"paragraph","id":"paragraph-ecaf8bfa8182405942f7b9ab0091aa3e","content":"PARIS, Dec. 8—  Gaelle Rabaste, who is 17, was not even born when Jim Morrison died of heart failure from an overdose of drugs and alcohol here on July 3, 1971. But on the day the lead singer of the Doors would have been 50, she crouched by his tomb, reading his poetry with tears in her eyes."},{"type":"entity","id":"entity-9929d8d4e8a57ba2f88e467bf8dda4a8","path":["paragraph-ecaf8bfa8182405942f7b9ab0091aa3e","content"],"startOffset":66,"endOffset":78,"reference":"5","entityClass":"person"},{"type":"entity","id":"entity-9929d8d4e8a57ba2f88e467bf8dda4a9","path":["paragraph-ecaf8bfa8182405942f7b9ab0091aa3e","content"],"startOffset":79,"endOffset":83,"reference":"6","entityClass":"norm_act"},{"type":"strong","id":"strong-e222e55288409912f5dc679b90bb3631","path":["paragraph-ecaf8bfa8182405942f7b9ab0091aa3e","content"],"startOffset":0,"endOffset":15},{"type":"paragraph","id":"paragraph-8f6a4f8a592e139653e69f10ebb1063e","content":"The grave itself was covered with flowers, love letters, poems and the inevitable bottle of whisky left by the hundreds of young Europeans and Americans who came to pay homage to him on his birthday. \\"Move on, move on,\\" security guards kept calling out. \\"Give other people a chance.\\""},{"type":"paragraph","id":"paragraph-be2d8c9df8787e1b8237c72bc97a5d48","content":"Nathalie Roux had come from Switzerland for the occasion, carrying her guitar in the hope of singing her own tribute. \\"After I heard Jim Morrison, my life changed,\\" the 18-year-old said. \\"He''s like a Messiah to me. I know it sounds silly, but he has helped me see things the way he would see them.\\""},{"type":"paragraph","id":"paragraph-552c9445c0847076e9f323b18b668437","content":"Even on days of no particular significance to Morrison devotees, his tomb is the main attraction in the huge Pere-Lachaise cemetery in eastern Paris, easily outdrawing the final resting places of the likes of Moliere, Chopin, Bizet, Proust, Oscar Wilde, Isadora Duncan, Edith Piaf and Maria Callas. Diverse Observances"},{"type":"paragraph","id":"paragraph-722c16cd7d533b6d41c2f1fd2a36c9a5","content":"Yet if \\"Jim Lives,\\" as myriad graffiti around his tomb proclaim, it is also because Paris has now embraced him as a cult figure: his birthday has been marked by film showings, photo exhibitions, concerts, radio and television specials, even a poetry reading at the Georges Pompidou Center."},{"type":"paragraph","id":"paragraph-99a78fbb33439383a25f5438f488568f","content":"Morrison moved here five months before his death, fleeing scandals provoked by his raucous performances and apparently hoping that he would be recognized as a writer in a city where Hemingway and other expatriate American writers had prospered. But \\"the end\\" he so often sang about soon came."},{"type":"paragraph","id":"paragraph-39bcfc04692a854641546142fc8da08e","content":"Not all Parisians are happy that he is buried here. Families who own nearby tombs have long campaigned for his remains to be evicted, complaining that his fans smoke marijuana, drink beer and liquor and generally behave badly. Indeed, two years ago, the 20th anniversary of his death turned into a riot when guards tried to close the cemetery at night."},{"type":"paragraph","id":"paragraph-fabeb25f07e8b07740e0e95542e3c28f","content":"Since then, a guard is permanently stationed at Morrison''s grave, but messages continue to appear on surrounding tombs. One directly behind the singer''s black marble headstone reads: \\"Adolf Hitler, who should be dead, is still alive . . . he lives in Miami . . . and you, who should be alive, are dead . . . but you are still among us. Frederic.\\""},{"type":"paragraph","id":"paragraph-911e785d1aaaa1652f92e4f446703b7d","content":"Other graffiti -- mainly in English, but also in French, Spanish, Portuguese and Italian -- are more direct: \\"Jim, you are the God,\\" \\"Jim, we need you,\\" \\"We love you and you make me feel alright,\\" \\"Jim, Welcome to the Severed Garden\\" and, perhaps most appropriately, \\"Stoned Immaculate.\\" Portable Statuary"},{"type":"paragraph","id":"paragraph-9f53c8542d56e297fd831a1f583b06e4","content":"A marble bust of the singer once stood on his tomb. First, fans began to chip off bits to take home as mementoes. Then it was covered with graffiti. Finally, in 1990, it was stolen. Now fans often carry their own busts or statues of Morrison to the grave as part of their tribute."},{"type":"paragraph","id":"paragraph-4b33e71bbf1b5dfe4c8c21acd724463a","content":"Fear of trouble brought extra security guards to the tomb today, but apart from discouraging beer drinking and keeping the crowds moving they had little to do. The visitors were in solemn mood, prefering to celebrate the creativity of the singer, poet and, to many, prophet rather than the violent self-destruction that marked his brief five years in the spotlight."},{"type":"paragraph","id":"paragraph-c2555c873a196b4f4f2bb1325b55a1f3","content":"Among the fans were few contemporaries, proof enough that he is far larger as a myth than he ever was as a star. Indeed, those at his grave today were almost all in their teens and 20''s, pilgrims who either were converted by older brothers and sisters or were led to Morrison by Oliver Stone''s movie \\"The Doors.\\""},{"type":"paragraph","id":"paragraph-969de715b61586f4b7aa0be1ecf722a2","content":"Yet what is the appeal of his almost-nihilistic message to this generation? \\"He''s not an example, but he''s a legend,\\" Florence Roger, a 14-year-old Parisian schoolgirl, said. \\"He wanted to die, to get close to death. Perhaps if he hadn''t been so drugged up, he wouldn''t have written such beautiful poetry.\\""},{"type":"paragraph","id":"paragraph-e2bf1e3a4d4e1eae6250902d5af681b6","content":"Rene Beuttkus, a 25-year-old who installs central heating for a living, drove with four friends from Dessau in eastern Germany to be here today. Why? \\"Because Jim gives another dimension to life,\\" he said. \\"It''s the words of his poems and his life.\\" Lyric Symbolism"},{"type":"paragraph","id":"paragraph-78342b2b07deb8da53b9a42fde74da19","content":"A tall, bearded Frenchman who refused to give his name said the message came from \\"up there.\\" And he tried to explain. \\"The song ''Riders on the Storm,'' is not about a motorbike,\\" he said, referring to a Doors hit. \\"It''s about seeing a light ahead and moving toward it.\\""},{"type":"paragraph","id":"paragraph-afd6d0cd6270cf6e61f5b37b240865af","content":"Christophe, a young Frenchman from Normandy, said he wished he had lived in the 1960''s. And for him, Morrison''s example was \\"to let things come the way they come.\\" Asked if that wasn''t passive, he said, \\"What else are we going to do when we''re unemployed and there''s nothing else in our lives?\\""},{"type":"paragraph","id":"paragraph-165fc962bc1362937ea37718c385c0d5","content":"He and a friend planned to spend the day at Pere-Lachaise. And wandering through were a group of schoolgirls from Finland, four long-haired Germans in matching leather trousers, a middle-aged Spanish woman who said nothing as she lighted a candle at the grave, and many more."},{"type":"paragraph","id":"paragraph-57cc60086beeafa91f217126bb59dd64","content":"Paul Will, a 24-year-old social worker from Wisconsin, said he came over from London because his Australian girlfriend, Shannon O''Hara, simply announced, \\"It''s got to be done.\\" And he was pleased he did. \\"Even Jimi Hendrix''s grave in Seattle isn''t this busy,\\" he said."},{"type":"paragraph","id":"paragraph-6e47b1dfa6721aa204308b9230ae2580","content":"Photo: Hundreds of mourners yesterday passed the grave of Jim Morrison at the Pere-Lachaise cemetery in Paris, leaving flowers, poems and love letters. (Jean-Marc Charles for The New York Times)"}]}',
  E'{"source":"http://www.nytimes.com/1993/12/09/arts/jim-morrison-s-fans-keep-his-fire-alight-in-a-birthday-homage.html","source_id":"nyt_articles","publisher":"New York Times","publisher_id":"nyt","need_validation":true,"rubrics":["2","3"],"entities":["2"],"cover":"","abstract":"Gaelle Rabaste, who is 17, was not even born when Jim Morrison died of heart failure from an overdose of drugs and alcohol here on July 3, 1971. But on the day the lead singer of the Doors would have been 50, she crouched by his tomb, reading his poetry with tears in her eyes."}'
),
(
  '2',
  'http://www.theguardian.com/world/2013/sep/26/nsa-surveillance-anti-vietnam-muhammad-ali-mlk',
  'false',
  E'Declassified NSA files show agency spied on Muhammad Ali and MLK',
  'mpro-article',
  '1.0.0',
  1,
  '2013-09-26T14:19:00.000Z',
  NOW(),
  NOW(),
  'testuser2',
  '{2,3}',
  E'{"schema":{"name":"mpro-article","version":"1.0.0"},"nodes":[{"type":"container","id":"body","nodes":["paragraph-eb2bec82e14e8f0bd824afa4f55a55ad","paragraph-7fc4922f605fe3275622d730c0f8b1e3","paragraph-f9f8e7ec9a9139072b5dba1a6bce5031","paragraph-473a86fd1b24c3d006989a666923f3a2","paragraph-98113c5c5d400a6efb9a2dde7370c68e","paragraph-b2bb0048b9339d3efa8976b45be5484f","paragraph-b1bc39be912bae3b14c5dbeb5d418b09","clipboard_property","paragraph-5487b792fea614eb9c1eea058148560f","paragraph-dbccbbd7605c51c5591de381b87a6c1c","paragraph-d33003e548e75a15315f52ed19f7166a","paragraph-a1419208561ee8a1f874c7d38c56360f","paragraph-92320e55022fa900d1ea54a9ba8c3302","paragraph-4798eb6922a530d7b59726a614e4fc8c","paragraph-a300cb3a7e2de7d3e849ab8579e41324","paragraph-864bbf3acaf839302d6a58a153708088","paragraph-a5dd007bc5b24a1a5f584119b483e23e","paragraph-c2986db1c7683cbf1a4d11dd7e95e484"]},{"type":"meta","id":"meta","title":"\\nDeclassified NSA files show agency spied on Muhammad Ali and MLK","rubrics":["2","3"]},{"type":"paragraph","id":"paragraph-eb2bec82e14e8f0bd824afa4f55a55ad","content":"The National Security Agency secretly tapped into the overseas phone calls of prominent critics of the Vietnam War, including Martin Luther King, Muhammad Ali and two actively serving US senators, newly declassified material has revealed."},{"type":"link","id":"link-32c132cb8e35f3b1a74f400f957743c1","path":["paragraph-eb2bec82e14e8f0bd824afa4f55a55ad","content"],"startOffset":126,"endOffset":144,"title":null,"url":"http://www.theguardian.com/us-news/martin-luther-king"},{"type":"paragraph","id":"paragraph-7fc4922f605fe3275622d730c0f8b1e3","content":"The NSA has been forced to disclose previously secret passages in its own officialfour-volume history  of its Cold War snooping activities. The newly-released material reveals the breathtaking – and probably illegal – lengths the agency went to in the late 1960s and 70s, in an attempt to try to hold back the rising tide of anti-Vietnam war sentiment."},{"type":"link","id":"link-d15965ebf127decffcc11c64ac6043a5","path":["paragraph-7fc4922f605fe3275622d730c0f8b1e3","content"],"startOffset":82,"endOffset":101,"title":null,"url":"http://www2.gwu.edu/~nsarchiv/NSAEBB/NSAEBB441/"},{"type":"paragraph","id":"paragraph-f9f8e7ec9a9139072b5dba1a6bce5031","content":"That included tapping into the phone calls and cable communications of two serving senators – the Idaho Democrat Frank Church and Howard Baker, a Republican from Tennessee who, puzzlingly, was a firm supporter of the war effort in Vietnam. The NSA  also intercepted the foreign communications of prominent journalists such as Tom Wicker of the New York Times and the popular satirical writer for the Washington Post, Art Buchwald."},{"type":"link","id":"link-615eeebccd25de6d62df0b7a318d3447","path":["paragraph-f9f8e7ec9a9139072b5dba1a6bce5031","content"],"startOffset":244,"endOffset":247,"title":null,"url":"http://www.theguardian.com/us-news/nsa"},{"type":"paragraph","id":"paragraph-473a86fd1b24c3d006989a666923f3a2","content":"Alongside King, a second leading civil rights figure, Whitney Young of the National Urban League, was also surreptitiously monitored. The heavyweight boxing champion, Muhammad Ali, was put on the watch list in about 1967 after he spoke out about Vietnam – he was jailed having refused to be drafted into the army, was stripped of his title, and banned from fighting – and is thought to have remained a target of surveillance for the next six years."},{"type":"link","id":"link-a2baf1086288c1c483bc35cb8948cbe9","path":["paragraph-473a86fd1b24c3d006989a666923f3a2","content"],"startOffset":167,"endOffset":179,"title":null,"url":"https://www.theguardian.com/sport/muhammad-ali"},{"type":"paragraph","id":"paragraph-98113c5c5d400a6efb9a2dde7370c68e","content":"The agency went to great lengths to keep its activities, known as operation Minaret, from public view. All reports generated for Minaret were printed on plain paper unadorned with the NSA logo or other identifying markings other than the stamp \\"For Background Use Only\\". They were delivered by hand directly to the White House, often going specifically to successive presidents Lyndon Johnson who set the programme up in 1967 and Richard Nixon."},{"type":"paragraph","id":"paragraph-b2bb0048b9339d3efa8976b45be5484f","content":"The lack of judicial oversight of the snooping programme led even the NSA''s own history to conclude that Minaret was \\"disreputable if not outright illegal\\"."},{"type":"paragraph","id":"paragraph-b1bc39be912bae3b14c5dbeb5d418b09","content":"The new disclosures were prized from the current NSA following an appeal to the Security Classification Appeals Panel by the National Security Archive, an independent research institute based at the George Washington university. \\"Clearly the NSA didn''t want to release this material but they were forced to do so by the American equivalent of the supreme court of freedom of information law,\\" said Matthew Aid, an intelligence historian specialising in the NSA."},{"type":"paragraph","id":"clipboard_property","content":"Advertisement"},{"type":"paragraph","id":"paragraph-5487b792fea614eb9c1eea058148560f","content":"Together with William Burr of the National Security Archive, Aid has co-authored an article in Foreign Policythat explores the significance of the new disclosures. In addition to the seven names of spying targets listed in the NSA history, the two authors confirmed the names of other targets on the watch list from a declassified document at the Gerald Ford presidential library in Ann Arbor, Michigan."},{"type":"link","id":"link-2c71020df89b4b603c863651bc5c000d","path":["paragraph-5487b792fea614eb9c1eea058148560f","content"],"startOffset":84,"endOffset":109,"title":null,"url":"http://www.foreignpolicy.com/articles/2013/09/25/it_happened_here_NSA_spied_on_senators_1970s"},{"type":"paragraph","id":"paragraph-dbccbbd7605c51c5591de381b87a6c1c","content":"They include the actor Jane Fonda, Weather Underground member Kathy Boudin and black power activist Stokely Carmichael. In total, some 1,650 individuals were tracked by the NSA between 1967 and 1973, though the identities of most of those people remain unknown."},{"type":"paragraph","id":"paragraph-d33003e548e75a15315f52ed19f7166a","content":"Aid told the Guardian that, in his view, the new material underscores the dangers of unfettered surveillance. Minaret was initially intended for drug traffickers and terrorist suspects, but was twisted, at the request of the White House, to become a tool for tracking legitimate political activities of war protesters."},{"type":"paragraph","id":"paragraph-a1419208561ee8a1f874c7d38c56360f","content":"\\"If there''s a lesson to be learned from all this, when we are dealing with a non-transparent society such as the intelligence community that has a vast amount of power, then abuses can and usually do happen.\\""},{"type":"paragraph","id":"paragraph-92320e55022fa900d1ea54a9ba8c3302","content":"Public concern about the clandestine interception of anti-war protesters in Minaret helped prompt debate in Congress that in turn led to the formation in 1978 of the Foreign intelligence surveillance (Fisa) court. Paradoxically, the Fisa court is now at the center of the furore surrounding NSA gathering of phone records and internet data  following the disclosures of Edward Snowden."},{"type":"link","id":"link-12387506ba0d424100995e5f20a9ada4","path":["paragraph-92320e55022fa900d1ea54a9ba8c3302","content"],"startOffset":291,"endOffset":339,"title":null,"url":"http://www.theguardian.com/law/2013/sep/17/fisa-court-bulk-phone-records-collection"},{"type":"paragraph","id":"paragraph-4798eb6922a530d7b59726a614e4fc8c","content":"In a further paradox, the Washington debate leading to the formation of the Fisa court  was spearheaded by the Church Committee – a Congressional panel named after its chair, Senator Frank Church. That was the same Frank Church who a few years before had himself been placed on the NSA watch list."},{"type":"link","id":"link-bf86419adc622db5461da00bd5edbbff","path":["paragraph-4798eb6922a530d7b59726a614e4fc8c","content"],"startOffset":76,"endOffset":86,"title":null,"url":"http://www.theguardian.com/law/fisa-court"},{"type":"paragraph","id":"paragraph-a300cb3a7e2de7d3e849ab8579e41324","content":"Advertisement"},{"type":"paragraph","id":"paragraph-864bbf3acaf839302d6a58a153708088","content":"\\"I suspect Senator Church never had any idea the NSA was tapping his phone,\\" Aid said."},{"type":"paragraph","id":"paragraph-a5dd007bc5b24a1a5f584119b483e23e","content":"In addition to the new details of Minaret, the declassified passages of the NSA history also disclose the more acceptable face of the agency''s work that played an important part in some of the biggest crises of the Cold War. Its signals tracking of the Soviet Union uncovered evidence in September 1962 that the USSR was put on high alert – a full month before the discovery of nuclear-capable ballistic missiles on Cuban soil provoked the Cuban missile crisis."},{"type":"paragraph","id":"paragraph-c2986db1c7683cbf1a4d11dd7e95e484","content":"A year earlier, the NSA similarly picked up early warning signals that indicated the East German Communist Party was considering blocking all crossing by foot over the border between East and West Berlin – a presager of the building of the Berlin Wall."}]}',
  E'{"source":"http://www.theguardian.com/world/2013/sep/26/nsa-surveillance-anti-vietnam-muhammad-ali-mlk","source_id":"guardian_articles","publisher":"The Guardian","publisher_id":"guardian","need_validation":true,"rubrics":["2","3"],"entities":["1"],"cover":"","abstract":"Operation Minaret set up in 1960s to monitor anti-Vietnam critics, branded \'disreputable if not outright illegal\' by NSA itself"}'
),
(
  '3',
  'https://www.thestar.com/entertainment/books/2016/04/16/rob-spillman-looks-back-at-the-fall-of-the-berlin-wall.html',
  'false',
  E'Rob Spillman looks back at the fall of the Berlin Wall',
  'mpro-article',
  '1.0.0',
  1,
  '2016-04-16T14:19:00.000Z',
  NOW(),
  NOW(),
  'testuser2',
  '{2}',
  E'{"schema":{"name":"mpro-article","version":"1.0.0"},"nodes":[{"type":"container","id":"body","nodes":["paragraph-4ed0e50456def6a90e0401fcbb4d8c21","paragraph-fa15ef8d0c1955bc710976757a3167be","paragraph-1f2f5a3b89c2cf9d9c286b1d64feba14","paragraph-af4da9530b0621640b55c81b5bc7aebe","paragraph-48e38f24acd91a84fab449e615d4ff24","paragraph-d2b491d9161e45e05de77db2645cdc34","paragraph-95d9a8f91f728ef0fcbdc86bad74126f"]},{"type":"meta","id":"meta","title":"Rob Spillman looks back at the fall of the Berlin Wall","rubrics":["2"]},{"type":"paragraph","id":"paragraph-4ed0e50456def6a90e0401fcbb4d8c21","content":"Recently, a new museum opened in Germany, dedicated to those who lived under the shadow of the Berlin Wall. The first 1,000 visitors to the Wall Museum received a small souvenir chunk from the concrete structure, a kitschy token of the 155-kilometre-long barrier that physically divided the city from its construction in 1961 to its eventual fall in 1989."},{"type":"paragraph","id":"paragraph-fa15ef8d0c1955bc710976757a3167be","content":"The Berlin Wall is more than just a Cold War relic or tourist destination for Rob Spillman. The co-founding editor of influential New York literary magazine Tin House spent much of his formative years in West Berlin. Restless and filled with romantic idealism, 25-year-old Spillman returned to the city just months after the Wall came down, seeking adventure, writerly purpose and bohemian camaraderie. He shares his youthful experiences in his new memoir, All Tomorrow’s Parties, a captivating coming-of-age story and snapshot of a city in flux."},{"type":"paragraph","id":"paragraph-1f2f5a3b89c2cf9d9c286b1d64feba14","content":"Spillman, the German-born son of divorced American opera musicians, did not have a typical upbringing. Instead of Little League or Boy Scout camp, he spent his youth immersed in theatre, hanging out at his father’s rehearsals and performances. Young Spillman knew he wanted an artistic life — and even performed in operas as a kid — but struggled with his own identity and dark feelings of being an outsider amongst free spirits, only finding solace among his books. “I knew I wanted to be creative,” he says, “being surrounded by creative people all my life, but I didn’t feel creative. Growing up surrounded by musicians and people who were living for their art definitely shaped the way I look at the world.”"},{"type":"paragraph","id":"paragraph-af4da9530b0621640b55c81b5bc7aebe","content":"Spillman was, at the time of the Wall’s fall, back in the U.S. working as a freelance writer along with his new wife, fellow author Elissa Schappell. Questioning whether his idealized artistic life could include marriage and a steady job, he convinced Schappell to move to Germany, and that’s when All Tomorrow’s Parties becomes a Hunter S. Thompson-esque journey. Fuelled on absinthe from a Portuguese dive bar, the two eventually settle in East Berlin, a city still in limbo — as riot police battle with both skinheads and anarchist settlers. Laundromats don’t exist yet, soup kitchens double as bars, and the streets are filled with old furniture, abandoned for newly available Western goods."},{"type":"paragraph","id":"paragraph-48e38f24acd91a84fab449e615d4ff24","content":"Despite his journalist credentials, Spillman didn’t write about this unique experience at the time. “I had this delusional notion that if I didn’t write about it, it would keep going, the magic would not go away,” he says. “Not the most logical thought I had, but that was the feeling when I was there.” Spillman calls writing All Tomorrow’s Parties a “10-year odyssey” in which he tried to be as “honest and empathetic as possible.” He imagined his audience to be his teenage self, or someone struggling with the same internal battles."},{"type":"paragraph","id":"paragraph-d2b491d9161e45e05de77db2645cdc34","content":"“I was writing the book not necessarily for people I know, but for the lost people out there who are adrift now,” says Spillman. “When I was 16, 18, a book saved my life, reading other people’s narratives, either fiction or non-fiction was pivotal for me. It showed there was a greater world out there, and I wasn’t alone.”"},{"type":"paragraph","id":"paragraph-95d9a8f91f728ef0fcbdc86bad74126f","content":"Sue Carter is the editor of Quill & Quire."}]}',
  E'{"source":"https://www.thestar.com/entertainment/books/2016/04/16/rob-spillman-looks-back-at-the-fall-of-the-berlin-wall.html","source_id":"thestar_articles","publisher":"Toronto Star","publisher_id":"thestar","need_validation":true,"rubrics":["2"],"entities":["4"],"cover":"","abstract":"Recently, a new museum opened in Germany, dedicated to those who lived under the shadow of the Berlin Wall. The first 1,000 visitors to the Wall Museum received a small souvenir chunk from the concrete structure, a kitschy token of the 155-kilometre-long barrier that physically divided the city from its construction in 1961 to its eventual fall in 1989."}'
);