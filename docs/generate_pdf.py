import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Draw decorative elements on Cover Page
            self.saveState()
            self.setFillColor(colors.HexColor("#1A3000"))
            self.rect(0, 0, 15, letter[1], fill=True, stroke=False)
            self.setFillColor(colors.HexColor("#4C6B00"))
            self.rect(15, 0, 5, letter[1], fill=True, stroke=False)
            self.restoreState()
            return
        
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#4C6B00"))
        
        # Header
        self.drawString(54, 750, "HOODNEST // SYSTEM ARCHITECTURE & BRANDING SPECIFICATION")
        self.setStrokeColor(colors.HexColor("#4C6B00"))
        self.setLineWidth(0.5)
        self.line(54, 742, letter[0] - 54, 742)
        
        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#666666"))
        self.line(54, 55, letter[0] - 54, 55)
        self.drawString(54, 42, "CONFIDENTIAL - HOODNEST INTERNAL SPECIFICATION")
        self.drawRightString(letter[0] - 54, 42, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def create_pdf(filename="hoodnest_brief.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    c_primary = colors.HexColor("#4C6B00")     # Forest Green
    c_secondary = colors.HexColor("#1A3000")   # Dark Forest / Hunter
    c_neutral_dark = colors.HexColor("#1A1A1A")# Body text
    c_neutral_light = colors.HexColor("#F7F7F4")# Warm Parchment
    c_accent = colors.HexColor("#CCFF00")       # Volt Green
    
    # Custom styles
    styles.add(ParagraphStyle(
        name='CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=c_primary,
        spaceAfter=15
    ))
    
    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#555555"),
        spaceAfter=40
    ))
    
    styles.add(ParagraphStyle(
        name='CoverMetadata',
        fontName='Courier',
        fontSize=9,
        leading=14,
        textColor=c_neutral_dark,
        spaceAfter=5
    ))

    styles.add(ParagraphStyle(
        name='ReportH1',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceBefore=22,
        spaceAfter=12,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='ReportH2',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_secondary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='ReportBody',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_neutral_dark,
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='ReportBodyItalic',
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#444444"),
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='ReportCode',
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#333333"),
        backColor=c_neutral_light,
        borderColor=colors.HexColor("#E2E2DC"),
        borderWidth=0.5,
        borderPadding=8,
        spaceAfter=10,
        spaceBefore=5
    ))

    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    ))

    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=c_neutral_dark
    ))

    styles.add(ParagraphStyle(
        name='TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=c_neutral_dark
    ))

    story = []
    
    # ------------------ COVER PAGE ------------------
    story.append(Spacer(1, 120))
    story.append(Paragraph("HOODNEST / HOODLINGS", styles['CoverTitle']))
    story.append(Paragraph("THE SYSTEM ARCHITECTURE & BRAND ARCHITECTURE COMPREHENSIVE BRIEF", styles['CoverSubtitle']))
    story.append(Spacer(1, 30))
    
    # Accent line
    t_line = Table([[""]], colWidths=[letter[0]-128], rowHeights=[4])
    t_line.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_primary),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_line)
    story.append(Spacer(1, 40))
    
    # Metadata block
    story.append(Paragraph("<b>Author:</b> Principal Systems Architect & Senior Software Engineer", styles['CoverMetadata']))
    story.append(Paragraph("<b>Version:</b> 2.2.0 (Stable Spec)", styles['CoverMetadata']))
    story.append(Paragraph("<b>Classification:</b> Confidential, Internal Engineering / Marketing Spec", styles['CoverMetadata']))
    story.append(Paragraph("<b>Target Platform:</b> 𝕏 API Integration, Node/NestJS Monolith, Next.js Web App", styles['CoverMetadata']))
    story.append(Paragraph("<b>Date:</b> July 29, 2026", styles['CoverMetadata']))
    
    story.append(PageBreak())
    
    # ------------------ SECTION 1: EXECUTIVE SUMMARY & VISION ------------------
    story.append(Paragraph("1. Executive Summary & Vision", styles['ReportH1']))
    story.append(Paragraph(
        "<b>Hoodnest</b> is an asynchronous, event-driven virtual pet simulation and RPG-lite ecosystem set in a "
        "medieval fantasy 'Robin Hood' universe. The system operates natively on <b>𝕏 (formerly Twitter)</b> "
        "via real-time timeline webhook hooks, and through a high-performance monospaced web portal application.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "The core differentiator is <b>sentience simulation</b>: digital companions (referred to as <b>Hoodlings</b>) "
        "are not static chatbots. They possess dynamic state machines, continuous semantic vector memories, distinct "
        "personalities that modify RPG encounter outcomes, and are capable of executing autonomous co-op adventures "
        "with other companions across the network.",
        styles['ReportBody']
    ))
    
    # ------------------ SECTION 2: BRAND IDENTITY & DESIGN AESTHETICS ------------------
    story.append(Paragraph("2. Brand Identity & Design Aesthetics", styles['ReportH1']))
    story.append(Paragraph(
        "The branding of Hoodnest represents a collision of medieval fantasy folklore and high-fidelity retro command terminals. "
        "This identity is structured across three primary layers:",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>Monospaced Minimalist Visuals:</b> All public dashboards and pages use monospace elements resembling a "
        "retro terminal, paired with warm parchment backgrounds (Hex <code>#F7F7F4</code>) and sharp, high-contrast forest neon primary highlights (Hex <code>#4C6B00</code>).",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>The Legendary Companions:</b> Sherwood Forest is populated by 12 unique animal species, each linked to a "
        "tactical guild faction and custom combat/utility role. Factions include <i>Forest Rangers</i>, <i>Recon Corps</i>, "
        "<i>Shadow Guild</i>, and <i>Wisdom & Command Council</i>.",
        styles['ReportBody']
    ))
    
    # Roster Table
    roster_headers = [
        Paragraph("Name", styles['TableHeader']),
        Paragraph("Species", styles['TableHeader']),
        Paragraph("Faction Group", styles['TableHeader']),
        Paragraph("Class & Duty", styles['TableHeader'])
    ]
    roster_rows = [
        roster_headers,
        [Paragraph("Robin Fox", styles['TableCellBold']), Paragraph("Fox", styles['TableCell']), Paragraph("Forest Rangers", styles['TableCell']), Paragraph("Ranger (Leader, archery, strategist)", styles['TableCell'])],
        [Paragraph("Hartley", styles['TableCellBold']), Paragraph("Deer", styles['TableCell']), Paragraph("Forest Rangers", styles['TableCell']), Paragraph("Hunter (Tracking, long-bow marksman)", styles['TableCell'])],
        [Paragraph("Little John", styles['TableCellBold']), Paragraph("Bear", styles['TableCell']), Paragraph("Forest Rangers", styles['TableCell']), Paragraph("Guardian (Team protector, physical strength)", styles['TableCell'])],
        [Paragraph("Harelock", styles['TableCellBold']), Paragraph("Hare", styles['TableCell']), Paragraph("Recon Corps", styles['TableCell']), Paragraph("Scout (Speedy messenger, map explorer)", styles['TableCell'])],
        [Paragraph("Nutley", styles['TableCellBold']), Paragraph("Squirrel", styles['TableCell']), Paragraph("Shadow Guild", styles['TableCell']), Paragraph("Rogue (Lockpicking, stealth infiltration)", styles['TableCell'])],
        [Paragraph("Badgerick", styles['TableCellBold']), Paragraph("Badger", styles['TableCell']), Paragraph("Logistics & Eng", styles['TableCell']), Paragraph("Quartermaster (Supplies & construction)", styles['TableCell'])],
        [Paragraph("Olliver", styles['TableCellBold']), Paragraph("Owl", styles['TableCell']), Paragraph("Wisdom Council", styles['TableCell']), Paragraph("Sage (Knowledge keeper, strategist)", styles['TableCell'])],
    ]
    t_roster = Table(roster_rows, colWidths=[1.1*inch, 1.0*inch, 1.8*inch, 3.1*inch])
    t_roster.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D2D2CA")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_neutral_light])
    ]))
    story.append(t_roster)
    
    story.append(PageBreak())
    
    # ------------------ SECTION 3: HOW TO USE (cara penggunaan) ------------------
    story.append(Paragraph("3. How to Use / Operational Flow", styles['ReportH1']))
    story.append(Paragraph(
        "Interacting with Hoodlings is completely frictionless. There are no downloads, installs, "
        "or complex login screens. All active management takes place directly on <b>𝕏 (Twitter)</b> by writing "
        "conversational tags, supported by a <b>Web Gallery Dashboard</b> to inspect character states in detail.",
        styles['ReportBody']
    ))
    
    story.append(Paragraph("A. Core Conversation Interactions on 𝕏", styles['ReportH2']))
    story.append(Paragraph(
        "Users communicate with the bot timeline using normal language. The integrated AI models automatically "
        "interpret user intents. The primary interactions are:",
        styles['ReportBody']
    ))
    
    # Interactions list
    story.append(Paragraph(
        "• <b>1. Summoning / Hatching:</b> To create a pet, a user tweets <code>@HoodNestfun hatch my hoodling</code> or <code>summon a companion</code>. "
        "The system checks the user's Twitter ID. If they do not already own a companion, the server assigns a random woodland species "
        "with an AI-generated name, a default role, and initial stats. The bot replies with a Welcome Card.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>2. Feeding:</b> To feed, the user tags the bot saying <code>@HoodNestfun serve him ramen</code> or <code>give my fox a cookie</code>. "
        "The LLM parses the text to identify the food type. It then applies vitals adjustments (lowering Hunger state), writes a contextually "
        "accurate response based on the pet's current mood, and replies. Cooldown is set to 60 minutes per feed command.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>3. Status Checks:</b> Users can inspect companion vitals dynamically by tweeting <code>@HoodNestfun how is my pet?</code> or <code>check status</code>. "
        "The system renders a card displaying Level, EXP, Health, Energy, Hunger, and Friendship values.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "• <b>4. Adventures:</b> By tweeting <code>@HoodNestfun my companion wants to explore</code> or <code>find a friend</code>, the companion enters a queue. "
        "It matches with another user's companion to embark on a shared RPG text adventure. The adventure outputs an event card outlining the narrative, "
        "dice rolls, modifiers applied, and results (EXP/item rewards).",
        styles['ReportBody']
    ))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("B. Web Dashboard Navigation", styles['ReportH2']))
    story.append(Paragraph(
        "For deep analysis, users visit the web portal (e.g. <code>hoodlings.xyz</code>). Here they can:<br/>"
        "• Authenticate using <b>Better Auth</b> via their Google, Discord, or X credentials.<br/>"
        "• Access a visual inventory dashboard mapping equipment (such as bows, cloaks, and boots) to overlay on their pixel companion.<br/>"
        "• View global ranking leaderboards displaying high-level and evolved companions.<br/>"
        "• Check public logs of past collaborative adventures between companions in Sherwood Forest.",
        styles['ReportBody']
    ))
    
    story.append(PageBreak())
    
    # ------------------ SECTION 4: COMPANION MATHEMATICS ------------------
    story.append(Paragraph("4. Dynamic Companion State Machine & Mathematics", styles['ReportH1']))
    story.append(Paragraph(
        "Each companion runs on a deterministic tick-based state engine. Below are the formulas and states governing "
        "vitals decay, active recovery, and personality influence modifiers during encounters.",
        styles['ReportBody']
    ))
    
    story.append(Paragraph("A. Vitals State Equations (Ticks defined as T = 1 hour)", styles['ReportH2']))
    story.append(Paragraph(
        "1. <b>Hunger Accumulation (H<sub>t</sub>):</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>H<sub>t</sub> = min(100, H<sub>t-1</sub> + &Delta;H)</i><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;Where &Delta;H = +5 per tick. If H<sub>t</sub> &ge; 50, companion becomes <code>Peckish</code>. If H<sub>t</sub> = 100, status transitions to <code>Famished</code>.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "2. <b>Energy Recovery & Cost (E<sub>t</sub>):</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <i>Passive Recovery:</i> E<sub>t</sub> = min(100, E<sub>t-1</sub> + 10) per idle tick.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <i>Action cost:</i> Conversations cost -5 energy. Adventures cost -20 energy.",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "3. <b>Health Decay (HP<sub>t</sub>):</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;If companion is <code>Famished</code> (Hunger = 100):<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>HP<sub>t</sub> = max(0, HP<sub>t-1</sub> - 10)</i> per tick. At HP = 0, companion enters the <code>Dead</code> state and must be revived with a Revive Potion.",
        styles['ReportBody']
    ))
    
    story.append(Paragraph("B. Personality Modifier Values", styles['ReportH2']))
    story.append(Paragraph(
        "A companion's personality acts as a coefficient vector applied to RPG dice rolls during adventure events:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>Roll = Base D20 + Stat Modifier + &delta;<sub>personality</sub></i>",
        styles['ReportBody']
    ))
    
    pers_headers = [
        Paragraph("Personality", styles['TableHeader']),
        Paragraph("Primary Mod", styles['TableHeader']),
        Paragraph("Positive Modifier (&delta;+)", styles['TableHeader']),
        Paragraph("Negative Modifier (&delta;-)", styles['TableHeader'])
    ]
    pers_rows = [
        pers_headers,
        [Paragraph("Brave", styles['TableCellBold']), Paragraph("Strength", styles['TableCell']), Paragraph("+4 on combat encounters", styles['TableCell']), Paragraph("-2 on stealth traps", styles['TableCell'])],
        [Paragraph("Wise", styles['TableCellBold']), Paragraph("Intelligence", styles['TableCell']), Paragraph("+4 on riddle traps", styles['TableCell']), Paragraph("-2 on physical combat", styles['TableCell'])],
        [Paragraph("Curious", styles['TableCellBold']), Paragraph("Luck", styles['TableCell']), Paragraph("+3 on discovery/loot", styles['TableCell']), Paragraph("+2 encounter danger rate", styles['TableCell'])],
        [Paragraph("Lazy", styles['TableCellBold']), Paragraph("Energy", styles['TableCell']), Paragraph("-50% passive energy decay", styles['TableCell']), Paragraph("-3 on speed check quests", styles['TableCell'])],
    ]
    t_pers = Table(pers_rows, colWidths=[1.5*inch, 1.5*inch, 2.0*inch, 2.0*inch])
    t_pers.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D2D2CA")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_neutral_light])
    ]))
    story.append(t_pers)
    
    story.append(PageBreak())
    
    # ------------------ SECTION 5: SYSTEM ARCHITECTURE ------------------
    story.append(Paragraph("5. Event-Driven Webhook & Queue Infrastructure", styles['ReportH1']))
    story.append(Paragraph(
        "To scale timeline interactions without hitting API rate limits or losing messages under heavy load, "
        "the backend runs a decoupled event gateway using NestJS, Redis, and BullMQ.",
        styles['ReportBody']
    ))
    
    story.append(Paragraph("A. Cryptographic Signature Verification", styles['ReportH2']))
    story.append(Paragraph(
        "To verify incoming payloads from 𝕏 and prevent replay attacks, the server executes HMAC SHA256 validation:",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "<code>import * as crypto from 'crypto';<br/>"
        "export function verifyXSignature(payload: string, signature: string, clientSecret: string): boolean {<br/>"
        "&nbsp;&nbsp;const hmac = crypto.createHmac('sha256', clientSecret).update(payload).digest('base64');<br/>"
        "&nbsp;&nbsp;return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));<br/>"
        "}</code>",
        styles['ReportCode']
    ))

    story.append(Paragraph("B. Concurrency Control & State Locking", styles['ReportH2']))
    story.append(Paragraph(
        "To prevent race conditions (e.g. double-feeding or simultaneous adventure actions), we execute distributed locks "
        "using Redis-based <code>Redlock</code> keys:",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "<code>const lockKey = `lock:companion:${companionId}`;<br/>"
        "const lock = await this.redis.set(lockKey, 'locked', 'PX', 5000, 'NX');<br/>"
        "if (!lock) {<br/>"
        "&nbsp;&nbsp;throw new ConflictException('Companion is currently processing another action.');<br/>"
        "}</code>",
        styles['ReportCode']
    ))

    # ------------------ SECTION 6: AI & MEMORY ------------------
    story.append(Paragraph("6. AI Prompting, Memory & Vector Search (RAG)", styles['ReportH1']))
    story.append(Paragraph(
        "Companions store and retrieve memories dynamically. Customer queries are embedded and matched against "
        "historical conversational vectors using <code>pgvector</code> cosine distance metrics:",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "<code>SELECT id, memory_key, memory_value, 1 - (embedding <=> :queryEmbedding) AS similarity<br/>"
        "FROM \"CompanionMemory\"<br/>"
        "WHERE \"companionId\" = :companionId AND 1 - (embedding <=> :queryEmbedding) > 0.78<br/>"
        "ORDER BY similarity DESC<br/>"
        "LIMIT 3;</code>",
        styles['ReportCode']
    ))
    
    story.append(PageBreak())
    
    # ------------------ SECTION 7: CARD RENDERING ENGINE ------------------
    story.append(Paragraph("7. Card Rendering Engine", styles['ReportH1']))
    story.append(Paragraph(
        "Instead of simple text replies, Hoodlings are generated as layered transparent PNG sprites "
        "and merged onto a custom card template (1200x675 px) before being uploaded to Twitter.",
        styles['ReportBody']
    ))
    story.append(Paragraph("Asset Stack Layers:", styles['ReportBody']))
    story.append(Paragraph("1. <b>Base Body Layer:</b> Unique woodland creature outline frames (Fox, Stag, Badger, etc.)", styles['ReportBody']))
    story.append(Paragraph("2. <b>Outfit Overlay Layer:</b> Outlaw jubah and hoods matching evolution levels (Hatchling, Scout, Guardian).", styles['ReportBody']))
    story.append(Paragraph("3. <b>Weapon Overlay Layer:</b> Transparent attachments mapping to equipped weapons (Bows, Staffs).", styles['ReportBody']))
    
    story.append(Spacer(1, 5))
    story.append(Paragraph("Backend canvas composition snippet:", styles['ReportH2']))
    story.append(Paragraph(
        "<code>const canvas = createCanvas(1200, 675);<br/>"
        "const ctx = canvas.getContext('2d');<br/>"
        "// Render background template<br/>"
        "ctx.drawImage(await loadImage('./assets/card_base.png'), 0, 0);<br/>"
        "// Compose layered companion frames<br/>"
        "ctx.drawImage(await loadImage(`./assets/pets/${species}/base.png`), 450, 100, 300, 300);<br/>"
        "ctx.drawImage(await loadImage(`./assets/pets/${species}/outfit_stage_${evolution}.png`), 450, 100, 300, 300);<br/>"
        "return canvas.toBuffer('image/webp');</code>",
        styles['ReportCode']
    ))

    # ------------------ SECTION 8: DATABASE SCHEMA ------------------
    story.append(Paragraph("8. Database Schema Reference (Prisma)", styles['ReportH1']))
    story.append(Paragraph(
        "The underlying models mapped in PostgreSQL using Prisma handle User configurations and companion status logs:",
        styles['ReportBody']
    ))
    story.append(Paragraph(
        "<code>model Companion {<br/>"
        "&nbsp;&nbsp;id           String&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@id @default(uuid())<br/>"
        "&nbsp;&nbsp;userId       String<br/>"
        "&nbsp;&nbsp;user         User&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@relation(fields: [userId], references: [id])<br/>"
        "&nbsp;&nbsp;name         String<br/>"
        "&nbsp;&nbsp;species      String<br/>"
        "&nbsp;&nbsp;personality  String<br/>"
        "&nbsp;&nbsp;evolutionLvl Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(1)<br/>"
        "&nbsp;&nbsp;level        Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(1)<br/>"
        "&nbsp;&nbsp;energy       Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(100)<br/>"
        "&nbsp;&nbsp;health       Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(100)<br/>"
        "&nbsp;&nbsp;hunger       Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(0)<br/>"
        "&nbsp;&nbsp;strength     Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(10)<br/>"
        "&nbsp;&nbsp;intelligence Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(10)<br/>"
        "&nbsp;&nbsp;luck         Int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@default(10)<br/>"
        "}</code>",
        styles['ReportCode']
    ))
    
    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    output_path = os.path.join(os.path.dirname(__file__), "hoodnest_brief.pdf")
    create_pdf(output_path)
    print(f"PDF generated successfully at: {output_path}")
